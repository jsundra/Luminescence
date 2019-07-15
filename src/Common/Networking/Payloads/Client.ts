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

export interface AssignChannelPayload extends Payload {
    addr: number;
    fixtureId: string;
}

export interface UpdateChannelPayload extends Payload {
    addr: number;
    values?: number[];
}
