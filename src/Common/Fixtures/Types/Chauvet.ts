import { FixtureDescriptor, FixtureModes } from 'Common/Fixtures/Types';

export class ChauvetQ6 implements FixtureDescriptor {
    public readonly name = 'Chauvet Q6';
    public readonly modes: FixtureModes[] = [ '4-Channel' ];
    public readonly components = { '4-Channel': [ 'RGB', 'A' ] };
}

export class ChauvetQ12 implements FixtureDescriptor {
    public readonly name = 'Chauvet Q12';
    public readonly modes: FixtureModes[] = [ '4-Channel' ];
    public readonly components = { '4-Channel': [ 'RGB', 'A' ] };
}

export class ChauvetQUV12 implements FixtureDescriptor {
    public readonly name = 'Chauvet QUV12';
    public readonly modes: FixtureModes[] = [ '6-Channel' ];
    public readonly components = { '6-Channel': [ 'RGB', 'A', 'W', 'UV' ]};
}

export class ChauvetH6 implements FixtureDescriptor {
    public readonly name = 'Chauvet H6';
    public readonly modes: FixtureModes[] = [ '6-Channel' ];
    public readonly components = { '6-Channel': [ 'RGB', 'A', 'W', 'UV' ]};
}

export class ChauvetColordashAccentQuad implements FixtureDescriptor {
    public readonly name = 'Colordash Accent Quad';
    public readonly modes: FixtureModes[] = [ '4-Channel' ];
    public readonly components = { '4-Channel': [ 'RGB', 'A' ] };
}