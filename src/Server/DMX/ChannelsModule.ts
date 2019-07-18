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
        this._boardData.markDirty();
    }

    public setAlias(address: number, alias: string): void {
        this._boardData.channels.fixtures[address].alias = alias;
        this._boardData.markDirty();
    }

    public setLevels(address: number, values: number[]): void {
        for (let i = 0; i < values.length; i++) {
            this._boardData.channels.values[address + i] = values[i];
        }
        this._boardData.markDirty();
    }
}
