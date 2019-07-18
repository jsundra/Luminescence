import { FixtureType } from '../Common/Fixtures/FixtureType';

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

export const MSG_ASSIGN_FIXTURE = 'MSG_ASSIGN_FIXTURE';
export interface MSG_ASSIGN_FIXTURE {
    addr: number;
    type: FixtureType;
}
