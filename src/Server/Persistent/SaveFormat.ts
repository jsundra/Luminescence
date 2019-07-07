import { BoardData } from 'Common/BoardData';

type DimmerData = {
    [address: number]: {
        name: string
    }
};

export interface IPersistentBoardData {
    dimmers: DimmerData;
}

export default class PersistentBoardData implements IPersistentBoardData {

    public readonly dimmers: DimmerData = <any>{};

    public setFromJSON(data: any) {
        for (const key in data) {
            // @ts-ignore
            this[key] = data[key];
        }
    }

    public setValues(data: BoardData): void {
        // Dimmers
        for (const i in data.dimmers.names) {
            const name = data.dimmers.names[i];
            if (name === undefined) continue;

            this.dimmers[i] = {
                name
            };
        }
    }

    public getBoardData(): BoardData {
        const rtn = new BoardData();

        // Dimmers
        for (const i in this.dimmers) {
            rtn.dimmers.names[i] = this.dimmers[i].name;
        }

        return rtn;
    }
}
