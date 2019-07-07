import BoardModule from './BoardModule';
import { DimmerData } from '../../Common/BoardData';

export default class DimmersModule extends BoardModule {

    public setLevel(address: number, data: number[]): void {
        console.log(`Dimmer: ${address} - ${data}`);
        this._boardData.dimmers.values.fillRange(address, data);
    }

    public setAlias(address: number, aliases: string[]): void {

    }

    public getDimmerInfo(): DimmerData {
        return <any> null;
    }
}
