import BoardModule from './BoardModule';
import { ArrayUtils } from 'Common/Util/ArrayUtils';


export default class DimmersModule extends BoardModule {

    public setLevel(address: number, data: number[]): void {
        ArrayUtils.fillRange(this._boardData.dimmers.values, address, data);
    }

    public setAlias(address: number, aliases: string[]): void {
        ArrayUtils.fillRange(this._boardData.dimmers.names, address, aliases);
        this._boardData.markDirty();
    }
}
