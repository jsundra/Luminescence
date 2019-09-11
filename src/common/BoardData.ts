import { FixtureDescriptor, FixtureDisplays, FixtureModeMap, FixtureModes } from 'Common/Fixtures/Types';
import { ColorUtil } from "../Client/Util/ColorUtil";
import RGB = ColorUtil.RGB;
import { IInflatable } from 'Common/ISerializeable';
import { Copy } from 'Common/Util/Copy';

type ChangeHandler = () => void;

export class BoardData implements IInflatable<BoardData> {

    public readonly output: OutputData = new OutputData(0);
    public readonly controls: ControlData = new ControlData();

    public readonly dimmers: DimmerData = new DimmerData();
    public readonly channels: ChannelData = new ChannelData();

    public readonly patch: PatchData = new PatchData();
    public readonly park: ParkData = new ParkData();

    public readonly chases: ChaseData = new ChaseData();

    private readonly persistentChangeHandlers: ChangeHandler[] = [];
    private readonly volatileChangeHandlers: ChangeHandler[] = [];

    public addListenerPersistent(handler: ChangeHandler): void {
        this.persistentChangeHandlers.push(handler);
    }

    public removeListenerPersistent(handler: ChangeHandler): void {
        this.persistentChangeHandlers.splice(this.persistentChangeHandlers.indexOf(handler), 1);
    }

    public addListenerVolatile(handler: ChangeHandler): void {
        this.volatileChangeHandlers.push(handler);
    }

    public removeListenerVolatile(handler: ChangeHandler): void {
        this.volatileChangeHandlers.splice(this.volatileChangeHandlers.indexOf(handler), 1);
    }

    public markDirty(): void {
        for (const handler of this.persistentChangeHandlers) {
            handler();
        }
    }

    public inflate(data: BoardData): void {
        this.channels.inflate(data.channels);
    }
}

export enum DimmerOwnership {
    Relinquished = 0,
    None,
    Focus,
    Parked,
}

export class OutputData {
    public readonly universe: number;
    public values: number[] = [];
    public owner: DimmerOwnership[] = [];

    public constructor(universe: number) { this.universe = universe; }
}

export class ControlData {
    public master: number = 1;
}

export class DimmerData {
    public values: number[] = [];
    public names: string[] = [];
}

export class ChannelData implements IInflatable<ChannelData> {
    // public values: number[] = [];
    public fixtures: {[index: number]: Fixture} = {};
    public values: number[] = [];

    public inflate(data: ChannelData): void {
        for (var index in data.fixtures) {
            this.fixtures[index] = Copy.inflate(Fixture, data.fixtures[index]);
        }
    }
}

export class Fixture {
    public descriptor: FixtureDescriptor;

    public stride: number;
    public mode: FixtureModes;
    public alias: string;

    // @ts-ignore
    public data: {[key: FixtureDisplays]: number};

    constructor() {

    }

    public setConstants(descriptor: FixtureDescriptor, stride: number): void {
        this.descriptor = descriptor;
        this.stride = stride;
    }

    public computeIntensities(): number[] {
        const rtn = [];

        let index = 0;
        const controls: FixtureDisplays[] = this.descriptor.components[this.mode];
        for (const key of Object.keys(controls)) {
            // @ts-ignore
            const type = controls[key];
            switch (type) {
                case ' ':
                case 'A':
                case 'W':
                case 'UV':
                    // @ts-ignore
                    rtn[index++] = this.data[type];
                    break;
                case 'RGB':
                    // @ts-ignore
                    const color: RGB = this.data[type].color;
                    // @ts-ignore
                    const dimmer: number = this.data[type].dimmer;
                    rtn[index++] = color.r * dimmer;
                    rtn[index++] = color.g * dimmer;
                    rtn[index++] = color.b * dimmer;
                    break;
                default:
                    throw new Error(`Fixture cannot commpute intensity for control type (${type})`);
            }
        }

        return rtn;
    }
}

export class PatchData {

}

export class ParkData {

}

export class ChaseData {

}
