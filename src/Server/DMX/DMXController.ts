import DMXAdapter from './Adapters/DMXAdapter';
import Timeout = NodeJS.Timeout;
import SystemConfig from '../Config/SystemConfig';
import { BoardData, DimmerData } from '../../Common/BoardData';
import DimmersModule from './DimmersModule';

export default class DMXController {

    public readonly dimmers: DimmersModule;

    private readonly _data: BoardData;

    private _adapter: DMXAdapter;

    private readonly _routing: Dict<number[]> = {};

    private _intervalId: Timeout;

    public constructor(config: SystemConfig) {
        this.dimmers = new DimmersModule(this._data);

        this._intervalId = setInterval(this.update.bind(this), config.dmx.sendRate)
    }

    public setAdapter(adapter: DMXAdapter) {
        if (this._adapter) {
            this._adapter.close();
        }

        this._adapter = adapter;

        if (this._adapter) {
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

    private update(): void {
        // TODO: Update chases

        // Send DMX
        if (this._adapter && this._data.dimmers.values.length > 0) {
            this._adapter.sendDMX(this._data.dimmers.values);
        }
    }

    private getRouting(address: number): number[] {
        return this._routing[address] || [ address ];
    }
}
