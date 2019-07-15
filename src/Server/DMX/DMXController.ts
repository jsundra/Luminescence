import DMXAdapter from './Adapters/DMXAdapter';
import SystemConfig from '../Config/SystemConfig';
import { BoardData, DimmerOwnership } from 'Common/BoardData';
import DimmersModule from './DimmersModule';
import BoardModule from './BoardModule';
import Timeout = NodeJS.Timeout;

export default class DMXController {

    public readonly dimmers: DimmersModule;

    private readonly _modules: BoardModule[];
    private readonly _data: BoardData;

    private _adapter: DMXAdapter;

    private _dmx: number[] = [];
    private _volatileChanges: boolean;
    private _intervalId: Timeout;

    public constructor(config: SystemConfig, data: BoardData) {
        this._data = data;
        this.dimmers = new DimmersModule(this, this._data);

        this._modules = [ // Set the order of ownership resolution.
            this.dimmers
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
            this._adapter.setMaxAddr(this._data.dimmers.count);
            this._adapter.open();
        }
    }

    // TODO: Make this safe so nothing can pass `relinquish` maliciously?
    public setDimmerValue(addr: number, ownership: DimmerOwnership, intensity?: number) {
        console.log(ownership);
        if (ownership == DimmerOwnership.Relinquished) {
            // Find a new owner, if any.
            let updated: boolean;
            for (const module of this._modules) {
                const intensity = module.getOutput(addr);
                if (!intensity) continue;

                this._data.output.owner[addr] = module.getOwnershipLevel();
                this._data.output.values[addr] = intensity;
                updated = true;
                break;
            }

            console.log(updated);
            if (!updated) {
                this._data.output.owner[addr] = DimmerOwnership.None;
                this._data.output.values[addr] = 0;
            }

        } else {
            // Set, if available.
            const curOwner = this._data.output.owner[addr];
            if (curOwner < ownership) return;

            if (curOwner > ownership) this._data.output.owner[addr] = ownership;
            this._data.output.values[addr] = intensity;
        }
    }

    private onVolatileDataChange(): void {
        this._volatileChanges = true;
    }

    private update(): void {
        // TODO: Update chases

        // Compose data
        // TODO: Dimmer count? Channel count? _shrugs_, need to define source of truth!
        for (let i = 0; i < this._data.dimmers.count; i++) {
            this._dmx[i] = this._data.dimmers.values[i] || this._data.channels.values[i];
        }

        // Send DMX
        if (this._adapter && this._data.dimmers.values.length > 0) {
            this._adapter.sendDMX(this._dmx);
        }
    }
}
