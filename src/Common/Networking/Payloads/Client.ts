import Payload from './Payload';
import { FixtureType } from 'Common/Fixtures/FixtureType';

export interface SetDimmerPayload extends Payload {
    addr: number;
    intensity?: number;
    alias?: string;
}

export interface SetParkPayload extends Payload {
    addr: number;
    intensity?: number;
}

export interface AssignFixturePayload extends Payload {
    addr: number;
    type: FixtureType;
}
