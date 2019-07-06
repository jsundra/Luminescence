import { Device } from 'usb';

export default abstract class DMXAdapter {

    protected _device: Device;

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

    public abstract sendDMX(dmx: number[]): void;
}
