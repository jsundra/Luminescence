import { FixtureDescriptor, FixtureModes } from 'Common/Fixtures/Types';

type ChangeHandler = () => void;

export class BoardData {

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
    public master: number;
}

export class DimmerData {
    public values: number[] = [];
    public names: string[] = [];
}

export class ChannelData {
    public values: number[] = [];
    public fixtures: {[index: number]: Fixture} = {};
}

export class Fixture {
    public readonly descriptor: FixtureDescriptor;

    public stride: number;
    public mode: FixtureModes;
    public alias: string;

    constructor(descriptor: FixtureDescriptor, stride: number) {
        this.descriptor = descriptor;
        this.stride = stride;
    }
}

export class PatchData {

}

export class ParkData {

}

export class ChaseData {

}
