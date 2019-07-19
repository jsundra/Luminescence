import { FixtureDescriptor } from '../Common/Fixtures/Types';
import { BoardData } from '../Common/BoardData';

// Data Update
export const MSG_DATA_UPDATE = 'MSG_DATA_UPDATE';
export interface MSG_DATA_UPDATE {
    latest: BoardData;
}

// Dimmers
export const MSG_UPDATE_DIMMER = 'MSG_UPDATE_DIMMER';
export interface MSG_UPDATE_DIMMER {
    addr: number;
    value?: number;
    alias?: string;
}

export const MSG_UNPARK_DIMMER = 'MSG_UNPARK_DIMMER';
export interface MSG_UNPARK_DIMMER {
    addr: number;
}

// Channels
export const MSG_ASSIGN_FIXTURE = 'MSG_ASSIGN_FIXTURE';
export interface MSG_ASSIGN_FIXTURE {
    addr: number;
    desc: FixtureDescriptor;
}

export const MSG_SET_FIXTURE = 'MSG_UPDATE_FIXTURE';
export interface MSG_SET_FIXTURE {
    addr: number;
    intensities?: number[];
    alias?: string;
}
