import { Device } from 'usb';

export default abstract class DMXAdapter {

    protected _device: Device;
    protected _dmx: number[] = [];

    public constructor(device: Device) {
        this._device = device;
    }

    // TODO: Check synchronous nature & success / exception
    public open(): void {
        this._device.open();
    }

    public close(): void {
        this._device.close();
    }

    public setAddress(address: number, data: number | number[]): void {
        if (typeof data == 'number') {
            this._dmx[address] = data;
        } else {
            for (const value of data) {
                this._dmx[address++] = value;
            }
        }
    }

    public sendDMX(): void {
        this._dmx.length = 0;
    }
}
