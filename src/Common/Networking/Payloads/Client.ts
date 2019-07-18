import Payload from './Payload';

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
    type: string;
}

export interface SetFixturePayload extends Payload {
    addr: number;
    intensities?: number[];
    alias?: string;
}
