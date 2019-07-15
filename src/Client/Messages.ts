export const MSG_UPDATE_DIMMER = 'MSG_UPDATE_DIMMER';
export interface UPDATE_DIMMER {
    addr: number;
    value?: number;
    alias?: string;
}

export const UNPARK_DIMMER = 'MSG_UNPARK_DIMMER';
export interface UNPARK_DIMMER {
    addr: number;
}
