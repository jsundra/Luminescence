import { FixtureType } from 'Common/Fixtures/FixtureType';
import SingleDimmer from 'Common/Fixtures/SingleDimmer';
import { Fixture } from 'Common/BoardData';
import GenericRGBA from 'Common/Fixtures/GenericRGBA';

export module FixtureUtils {
    export function mapFixture(type: FixtureType): Fixture {
        switch (type) {
            case 'Single Dimmer':
                return new SingleDimmer();
            case 'Generic RGBA':
                return new GenericRGBA();
        }
    }
}
