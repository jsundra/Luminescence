import { BoardData } from 'Common/BoardData';

export default abstract class BoardModule {

    protected _boardData: BoardData;

    public constructor(boardData: BoardData) {
        this._boardData = boardData;
    }
}
