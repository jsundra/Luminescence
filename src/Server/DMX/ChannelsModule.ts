import BoardModule from './BoardModule';
import { DimmerOwnership, Fixture } from '../../Common/BoardData';

export default class ChannelsModule extends BoardModule {

    public getOutput(addr: number): Nullable<number> {
        return null;
    }

    public getOwnershipLevel(): DimmerOwnership {
        return DimmerOwnership.None;
    }

    public assignFixture(address: number, fixture: Fixture): void {
        this._boardData.channels.fixtures[address] = fixture;
    }

    public updateFixture(channel: number, values: number[]): void {
        this._boardData.channels.values.fillRange(channel, values);
    }
}
