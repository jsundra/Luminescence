import BoardModule from './BoardModule';
import { ArrayUtils } from 'Common/Util/ArrayUtils';
import { DimmerOwnership } from '../../Common/BoardData';


export default class DimmersModule extends BoardModule {

    public getOutput(addr: number): Nullable<number> {
        console.log(this._boardData.dimmers.values);
        return this._boardData.dimmers.values[addr];
    }

    public getOwnershipLevel(): DimmerOwnership {
        return DimmerOwnership.Parked;
    }

    public setLevel(address: number, intensity?: number): void {
        const addr = address;

        if (intensity) {
            this._boardData.dimmers.values[ addr ] = intensity;
            this._dmxController.setDimmerValue(addr, DimmerOwnership.Parked, intensity);
        } else {
            this._boardData.dimmers.values[ addr ] = undefined;
            this._dmxController.setDimmerValue(addr, DimmerOwnership.Relinquished, intensity);
        }

        this._boardData.markDirty();
    }

    public setAlias(address: number, alias: string): void {
        this._boardData.dimmers.names[address] = alias;
        this._boardData.markDirty();
    }
}
