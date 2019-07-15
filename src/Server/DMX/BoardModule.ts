import { BoardData, DimmerOwnership } from 'Common/BoardData';
import DMXController from './DMXController';

export default abstract class BoardModule {

    protected _dmxController: DMXController;
    protected _boardData: BoardData;

    public constructor(dmxController: DMXController, boardData: BoardData) {
        this._dmxController = dmxController;
        this._boardData = boardData;
    }

    public abstract getOwnershipLevel(): DimmerOwnership;
    public abstract getOutput(addr: number): Nullable<number>
}
