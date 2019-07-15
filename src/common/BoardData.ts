type ChangeHandler = () => void;

export class BoardData {

    public readonly output: OutputData = new OutputData(0);

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
    Parked = 0,
    Focus = 1,
    None,
    Relinquished
}

export class OutputData {
    readonly universe: number;
    values: number[] = [];
    owner: DimmerOwnership[] = [];

    public constructor(universe: number) { this.universe = universe; }
}

export class DimmerData {
    count: number;
    values: number[] = [];
    names: string[] = [];
}

export class ChannelData {
    count: number;
    values: number[] = [];
    fixtures: {[index: number]: Fixture} = {};
}

export class Fixture {
    stride: number;
    name: string;
    alias: string;
}

export class PatchData {

}

export class ParkData {

}

export class ChaseData {

}
