import { Fixture } from 'Common/BoardData';
import { FixtureType } from 'Common/Fixtures/FixtureType';

export default class SingleDimmer implements Fixture {
    readonly type: FixtureType = 'Single Dimmer';
    readonly stride: number = 1;

    alias: string;
}
