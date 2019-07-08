export const MSG_UPDATE_DIMMER = 'MSG_UPDATE_DIMMER';
export interface UPDATE_DIMMER {
    addr: number;
    value?: number;
    alias?: string;
}
