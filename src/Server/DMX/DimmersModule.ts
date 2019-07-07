import BoardModule from './BoardModule';
import { DimmerData } from 'Common/BoardData';
import { ArrayUtils } from 'Common/Util/ArrayUtils';


export default class DimmersModule extends BoardModule {

    public setLevel(address: number, data: number[]): void {
        console.log(`Dimmer: ${address} - ${data}`);
        ArrayUtils.fillRange(this._boardData.dimmers.values, address, data);
    }

    public setAlias(address: number, aliases: string[]): void {
        console.log(`Dimmer: ${address} - ${aliases}`);
        ArrayUtils.fillRange(this._boardData.dimmers.names, address, aliases);
        this._boardData.markDirty();
    }

    public getDimmerInfo(): DimmerData {
        return <any> null;
    }
}
