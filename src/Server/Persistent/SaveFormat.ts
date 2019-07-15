import { BoardData } from 'Common/BoardData';

type DimmerData = {
    [address: number]: {
        name: string,
        value?: number
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
        for (let i = 0; i < data.dimmers.count; i++) {
            this.dimmers[i] = {
                name: data.dimmers.names[i],
                value: data.dimmers.values[i]
            };
        }
    }

    public getBoardData(): BoardData {
        const rtn = new BoardData();

        // Dimmers
        for (const i in this.dimmers) {
            const data = this.dimmers[i];
            rtn.dimmers.names[i] = data.name;
            rtn.dimmers.values[i] = data.value
        }

        return rtn;
    }
}
