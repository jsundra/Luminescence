export type AdapterConfig = {
    name: string;
    vendorId: number;
    productId: number;
}

export type DMXConfig = {
    sendRate: number
};

export default class SystemConfig {

    public constructor() {
        this.adapters = null;
        this.dmx = null;
    }

    public adapters: AdapterConfig[];
    public dmx: DMXConfig;

}
