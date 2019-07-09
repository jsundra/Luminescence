import Payload from './Payload';

export interface SetDimmerPayload extends Payload {
    addr: number;
    levels?: number[];
    aliases?: string[];
}

export interface AssignChannelPayload extends Payload {
    addr: number;
    fixtureId: string;
}

export interface UpdateChannelPayload extends Payload {
    addr: number;
    values?: number[];
}
