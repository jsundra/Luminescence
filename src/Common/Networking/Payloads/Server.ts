import { BoardData } from 'Common/BoardData';

export interface StatusPayload {
    adapter: Nullable<string>;
}

export interface DataUpdate {
    latest: BoardData;
}
