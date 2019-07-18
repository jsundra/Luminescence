import { ChauvetQ12, ChauvetQ6, ChauvetQUV12 } from 'Common/Fixtures/Types/Chauvet';
import { Ellipsoidal } from 'Common/Fixtures/Types/StageRight';

export type FixtureModes = '1-Channel' | '4-Channel' | '6-Channel' | '9-Channel';
export type FixtureDisplays = ' ' | 'RGB' | 'A' | 'W' | 'UV';

export interface FixtureDescriptor {
    name: string;
    modes: FixtureModes[];
    components: {
        // @ts-ignore
        [key: FixtureModes]: FixtureDisplays[]
    }
}

export class SingleDimmer implements FixtureDescriptor {
    public readonly name = 'Single Dimmer';
    public readonly modes: FixtureModes[] = [ '1-Channel' ];
    public readonly components = { '1-Channel': [' '] };
}

// TODO: Load these from a file and don't define in .ts files
export const AllFixtureTypes: FixtureDescriptor[] = [
    new SingleDimmer(),
    new ChauvetQ6(),
    new ChauvetQ12(),
    new ChauvetQUV12(),
    new Ellipsoidal()
];
