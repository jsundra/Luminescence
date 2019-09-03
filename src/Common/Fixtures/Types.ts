import {
    ChauvetColordashAccentQuad,
    ChauvetH6,
    ChauvetQ12,
    ChauvetQ6,
    ChauvetQUV12
} from 'Common/Fixtures/Types/Chauvet';
import { Ellipsoidal } from 'Common/Fixtures/Types/StageRight';

export type FixtureModes = '1-Channel' | '4-Channel' | '6-Channel' | '9-Channel';
export type FixtureDisplays = ' ' | 'RGB' | 'A' | 'W' | 'UV';

type FullModeMap = {
    '1-Channel': FixtureDisplays[];
    '4-Channel': FixtureDisplays[];
    '6-Channel': FixtureDisplays[];
    '9-Channel': FixtureDisplays[];
}

// {[key: FixtureModes]: FixtureDisplays[]};
export type FixtureModeMap = Partial<FullModeMap>

export type FixtureData = {
    ' ': number;
    'RGB': number;
    'A': number;
    'W': number;
    'UV': number;
}

export interface FixtureDescriptor {
    name: string;
    modes: FixtureModes[];
    components: FixtureModeMap;
}

export class SingleDimmer implements FixtureDescriptor {
    public readonly name = 'Single Dimmer';
    public readonly modes: FixtureModes[] = [ '1-Channel' ];
    public readonly components: FixtureModeMap = { '1-Channel': [' '] };
}

// TODO: Load these from a file and don't define in .ts files
export const AllFixtureTypes: FixtureDescriptor[] = [
    new SingleDimmer(),
    new ChauvetQ6(),
    new ChauvetQ12(),
    new ChauvetQUV12(),
    new ChauvetColordashAccentQuad(),
    new ChauvetH6(),
    new Ellipsoidal()
];
