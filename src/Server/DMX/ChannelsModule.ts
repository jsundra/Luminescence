import BoardModule from './BoardModule';
import { DimmerOwnership, Fixture } from '../../Common/BoardData';
import { FixtureDescriptor } from '../../Common/Fixtures/Types';
import { FixtureUtils } from '../../Common/Fixtures/FixtureUtils';

export default class ChannelsModule extends BoardModule {

    public getOutput(addr: number): Nullable<number> {
        return null;
    }

    public getOwnershipLevel(): DimmerOwnership {
        return DimmerOwnership.None;
    }

    public assignFixture(address: number, desc: FixtureDescriptor): void {
        this._boardData.channels.fixtures[address] = FixtureUtils.createFromDescriptor(desc);
    }

    public updateFixture(channel: number, values: number[]): void {
        this._boardData.channels.values.fillRange(channel, values);
    }
}
