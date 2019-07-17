import { Fixture } from 'Common/BoardData';
import { FixtureType } from 'Common/Fixtures/FixtureType';

export default class GenericRGBA implements Fixture {
    readonly type: FixtureType = 'Generic RGBA';
    readonly stride: number = 4;

    alias: string;
}
