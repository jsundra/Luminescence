export type DMXConfig = {
    sendRate: number
};

export default class SystemConfig {

    public constructor() {
        this.dmx = null;
    }

    public dmx: DMXConfig;

}
