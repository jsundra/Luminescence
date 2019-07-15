import DMXAdapter from './Adapters/DMXAdapter';
import Timeout = NodeJS.Timeout;
import SystemConfig from '../Config/SystemConfig';
import { BoardData, DimmerData } from 'Common/BoardData';
import DimmersModule from './DimmersModule';

export default class DMXController {

    public readonly dimmers: DimmersModule;

    private readonly _data: BoardData;

    private _adapter: DMXAdapter;

    private _dmx: number[] = [];
    private _volatileChanges: boolean;
    private _intervalId: Timeout;

    public constructor(config: SystemConfig, data: BoardData) {
        this._data = data;
        this.dimmers = new DimmersModule(this._data);

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

    public setChannel(address: number, data: number[]) : void {
        // if (typeof data === 'number') data = [ data ];
        //
        // for (const value of data) {
        //     const routing = this.getRouting(address++);
        //     for (const dimmer of routing) {
        //         this._dimmerValues.fillRange(dimmer, value);
        //     }
        // }
    }

    private onVolatileDataChange(): void {
        this._volatileChanges = true;
    }

    private update(): void {
        // TODO: Update chases

        for (let i = 0; i < this._data.output.values.length; i++) {
            const dimmerValue = this._data.dimmers.values[i];
            if (dimmerValue) {
                this._data.output.values[i] = dimmerValue;
                this._data.output.owner[i] = 'park';
            }
        }

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
