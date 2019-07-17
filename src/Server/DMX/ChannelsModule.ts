import BoardModule from './BoardModule';
import { DimmerOwnership, Fixture } from '../../Common/BoardData';
import { FixtureType } from '../../Common/Fixtures/FixtureType';
import { FixtureUtils } from '../../Common/Fixtures/FixtureUtils';

export default class ChannelsModule extends BoardModule {

    public getOutput(addr: number): Nullable<number> {
        return null;
    }

    public getOwnershipLevel(): DimmerOwnership {
        return DimmerOwnership.None;
    }

    public assignFixture(address: number, type: FixtureType): void {
        this._boardData.channels.fixtures[address] = FixtureUtils.mapFixture(type);
    }

    public updateFixture(channel: number, values: number[]): void {
        this._boardData.channels.values.fillRange(channel, values);
    }
}
