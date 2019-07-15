import * as fs from 'fs';
import { BoardData } from 'Common/BoardData';
import PersistentBoardData from './SaveFormat';

// TODO: Make this dynamically detect changes & save

export default class FileSync {

    private readonly WRITE_DELAY_MS = 1000;
    private _writePending: boolean = false;

    private _saveData: PersistentBoardData = new PersistentBoardData();

    public loadFromDisk(src: string): BoardData {

        console.log(`Loading BoardData from disk: ${src}`);
        try {
            this._saveData.setFromJSON(JSON.parse(fs.readFileSync(src, 'utf8')));
        } catch(e) {
            console.error(`Error loading BoardData from disk!
-> Error: ${e}
-> Src: ${src}`);
            return new BoardData();
        }

        return this._saveData.getBoardData();
    }

    public saveToDisk(src: string, data: BoardData): void {
        if (!this._writePending) {
            this._writePending = true;

            setTimeout(() => {
                this._writePending = false;

                console.log(`Saving BoardData to disk: ${src}`);

                function logError(err: Error) {
                    console.error(`Error saving BoardData to disk!
-> Error: ${err}
-> Src: ${src}`);
                }

                this._saveData.setValues(data);

                try {
                    fs.writeFile(src, JSON.stringify(this._saveData), (err) => {
                        if (err) logError(err);
                    })
                } catch(e) {
                    logError(e);
                }
            }, this.WRITE_DELAY_MS);
        }
    }
}
