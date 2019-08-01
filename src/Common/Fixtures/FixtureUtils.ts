import { AllFixtureTypes, FixtureDescriptor } from 'Common/Fixtures/Types';
import { Fixture } from 'Common/BoardData';

export module FixtureUtils {

    export function descriptorFromName(name: string): FixtureDescriptor {
        for (const desc of AllFixtureTypes) {
            if (desc.name == name) return desc;
        }
        throw new Error(`Unable to find FixtureDescriptor for: ${name}`);
    }

    // TODO: Remove this unholiness
    function getStride(name: string): number {
        switch (name) {
            case 'Single Dimmer':
                return 1;
            case 'Chauvet Q6':
            case 'Chauvet Q12':
            case 'Chauvet QUV12':
                return 4;
            case 'Chauvet H6':
                return 6;
            case 'Ellipsoidal':
                return 9;
        }
    }

    export function createFromDescriptor(desc: FixtureDescriptor, data?: Dict<any>): Fixture {
        const fixture = new Fixture(desc, getStride(desc.name));

        fixture.mode = desc.modes[0];
        if (data) fixture.loadData(data);
        return fixture;
    }
}
