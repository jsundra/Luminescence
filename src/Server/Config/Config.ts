import * as fs from 'fs';
import SystemConfig from './SystemConfig';

export default class Config {

    public system: SystemConfig;

    public loadFromFilesystem(): void {
        this.system = loadFromFile(SystemConfig, './data/system.json');
    }

}

function loadFromFile(configType: any, src: string): any {
    const defaultConfig = new configType();

    const fileData = JSON.parse(fs.readFileSync(src).toString('utf8'));
    if (!fileData || Object.keys(fileData).length == 0) return;

    for (const key in defaultConfig) {
        const defaultData = defaultConfig[key];

        if (typeof defaultData !== 'function') {
            const fileKeyData = fileData[key];
            if (fileKeyData) {
                // TODO: Handle deep globbing, not just one level
                defaultConfig[key] = { ...defaultData, ...fileKeyData };
            }
        }
    }

    return defaultConfig;
}
