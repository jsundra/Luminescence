import { BoardData, DimmerOwnership } from 'Common/BoardData';
import { FixtureUtils } from '../../Common/Fixtures/FixtureUtils';

type DimmerSave = {
    [address: number]: {
        name: string,
        value?: number
    }
};

type ChannelSave = {
    [address: number]: {
        type: string,
        alias: string
        values?: number[];
    };
}

export interface IPersistentBoardData {
    dimmers: DimmerSave;
    channels: ChannelSave;
}

export default class PersistentBoardData implements IPersistentBoardData {

    public readonly dimmers: DimmerSave = <any>{};
    public readonly channels: ChannelSave = <any>{};

    public setFromJSON(data: any) {
        for (const key in data) {
            // @ts-ignore
            this[key] = data[key];
        }
    }

    public setValues(data: BoardData): void {
        // Dimmers
        for (let i = 0; i < data.output.values.length; i++) {
            this.dimmers[i] = {
                name: data.dimmers.names[i],
                value: data.dimmers.values[i]
            };
        }

        // Channels
        for (const addr in data.channels.fixtures) {
            const fixture = data.channels.fixtures[addr];
            const addrNum = Number.parseInt(addr);
            this.channels[addr] = {
                type: fixture.descriptor.name,
                alias: fixture.alias,
                values: data.channels.values.slice(addrNum, addrNum + fixture.stride)
            }
        }
    }

    public getBoardData(): BoardData {
        const rtn = new BoardData();

        // Output
        for (const i in this.dimmers) {
            rtn.output.owner[i] = DimmerOwnership.None;
        }

        // Dimmers
        for (const i in this.dimmers) {
            const data = this.dimmers[i];
            rtn.dimmers.names[i] = data.name;
            rtn.dimmers.values[i] = data.value;
        }

        // Channels
        for (const i in this.channels) {
            const iNum = Number.parseInt(i);
            const data = this.channels[i];
            const fixture = FixtureUtils.createFromDescriptor(FixtureUtils.descriptorFromName(data.type));

            fixture.alias = data.alias;
            rtn.channels.fixtures[i] = fixture;
            for (let j = 0; j < data.values.length; j++) {
                // @ts-ignore
                rtn.channels.values[iNum + j] = data.values[j];
            }
        }

        return rtn;
    }
}
