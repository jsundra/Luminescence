import DMXAdapter from './Adapters/DMXAdapter';
import { Common } from '../../@types';
import Dict = Common.Dict;
import { uptime } from 'os';
import Timeout = NodeJS.Timeout;
import Dimmers from './Dimmers';
import SystemConfig from '../Config/SystemConfig';

export default class DMXController {

    public readonly dimmers: Dimmers = new Dimmers();

    private _adapter: DMXAdapter;

    private readonly _routing: Dict<number[]> = {};
    private readonly _dimmerValues: number[] = [];

    private _intervalId: Timeout;

    public constructor(config: SystemConfig) {
        this._intervalId = setTimeout(uptime, config.dmx.sendRate)
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

    public setDimmer(address: number, data: number | number[]): void {
        this._dimmerValues.fillRange(address, data);
    }

    public setChannel(address: number, data: number | number[]) : void {
        if (typeof data === 'number') data = [ data ];

        for (const value of data) {
            const routing = this.getRouting(address++);
            for (const dimmer of routing) {
                this._dimmerValues.fillRange(dimmer, value);
            }
        }
    }

    private update(): void {
        // TODO: Update chases

        // Send DMX
        if (this._adapter) {
            this._adapter.sendDMX(this._dimmerValues);
        }
    }

    private getRouting(address: number): number[] {
        return this._routing[address] || [ address ];
    }
}
