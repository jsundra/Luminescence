import DMXAdapter from './Adapters/DMXAdapter';
import SystemConfig from '../Config/SystemConfig';
import { BoardData, ControlData, DimmerOwnership } from 'Common/BoardData';
import DimmersModule from './DimmersModule';
import BoardModule from './BoardModule';
import Timeout = NodeJS.Timeout;
import ChannelsModule from './ChannelsModule';

export default class DMXController {

    public readonly dimmers: DimmersModule;
    public readonly channels: ChannelsModule;

    private readonly _modules: BoardModule[];
    private readonly _data: BoardData;

    private _adapter: DMXAdapter;
    private _dmx: number[] = [ 0 ]; // Pad leading 0 to make things A LOT more sane, and add DMX protocol chaplaincy here.

    private _volatileChanges: boolean;
    private _intervalId: Timeout;

    public constructor(config: SystemConfig, data: BoardData) {
        this._data = data;
        this.dimmers = new DimmersModule(this, this._data);
        this.channels = new ChannelsModule(this, this._data);

        this._modules = [ // Set the order of ownership resolution.
            this.dimmers,
            this.channels
        ];

        this._data.addListenerVolatile(this.onVolatileDataChange);
        this._intervalId = setInterval(this.update.bind(this), config.dmx.sendRate)
    }

    public setAdapter(adapter: DMXAdapter) {
        if (this._adapter) {
            this._adapter.close();
        }

        this._adapter = adapter;

        if (this._adapter) {
            this._adapter.setMaxAddr(this._data.output.values.length);
            this._adapter.open();
        }
    }

    public setControl(control: keyof ControlData, value: number): void {
        this._data.controls[control] = value;
        this._data.markDirty();
    }

    // TODO: Make this safe so nothing can pass `relinquish` maliciously?
    public setDimmerValue(addr: number, ownership: DimmerOwnership, intensity?: number) {
        if (ownership == DimmerOwnership.Relinquished) {
            // Find a new owner, if any.
            let updated: boolean;
            for (const module of this._modules) {
                const intensity = module.getOutput(addr);
                if (intensity == undefined || intensity == null) continue;

                this._data.output.owner[addr] = module.getOwnershipLevel();
                this._data.output.values[addr] = intensity;
                updated = true;
                break;
            }

            if (!updated) {
                this._data.output.owner[addr] = DimmerOwnership.None;
                this._data.output.values[addr] = 0;
            }
        } else {
            // Set, if available.
            const curOwner = this._data.output.owner[addr];
            if (curOwner > ownership) return;

            if (curOwner < ownership) this._data.output.owner[addr] = ownership;
            this._data.output.values[addr] = intensity;
        }
    }

    private onVolatileDataChange(): void {
        this._volatileChanges = true;
    }

    private update(): void {
        // TODO: Update chases

        for (let i = 1; i < this._data.output.values.length; i++) {
            const ignoreGM = this._data.output.owner[i] === DimmerOwnership.Parked;
            this._dmx[i] = ignoreGM
                ? this._data.output.values[i]
                : this._data.output.values[i] * this._data.controls.master;
        }

        // Send DMX
        if (this._adapter && this._data.dimmers.values.length > 0) {
            this._adapter.sendDMX(this._dmx);
        }
    }
}
