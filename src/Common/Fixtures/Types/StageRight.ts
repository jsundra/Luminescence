import { FixtureDescriptor, FixtureDisplays, FixtureModes } from 'Common/Fixtures/Types';

export class Ellipsoidal implements FixtureDescriptor {
    public readonly name = 'Ellipsoidal';
    public readonly modes: FixtureModes[] = [ '9-Channel' ];
    public readonly components: { '9-Channel': [ 'RGB' ] };
}
