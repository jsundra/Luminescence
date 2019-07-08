type ChangeHandler = () => void;

export class BoardData {

    public readonly dimmers: DimmerData = new DimmerData();
    public readonly patch: PatchData = new PatchData();
    public readonly park: ParkData = new ParkData();

    public readonly chases: ChaseData = new ChaseData();

    private readonly changeHandlers: ChangeHandler[] = [];

    public addChangeListener(handler: ChangeHandler): void {
        this.changeHandlers.push(handler);
    }

    public removeChangeListener(handler: ChangeHandler): void {
        this.changeHandlers.splice(this.changeHandlers.indexOf(handler), 1);
    }

    public markDirty(): void {
        for (const handler of this.changeHandlers) {
            handler();
        }
    }
}

export class DimmerData {
    count: number;
    values: number[] = [];
    names: string[] = [];
}

export class PatchData {

}

export class ParkData {

}

export class ChaseData {

}
