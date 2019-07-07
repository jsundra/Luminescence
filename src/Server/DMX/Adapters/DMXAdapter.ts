import { Device } from 'usb';

export default abstract class DMXAdapter {

    public static readonly NAME: string;
    public static readonly PRODUCT_ID: number;
    public static readonly VENDOR_ID: number;

    protected _device: Device;

    public get usbDevice(): Device { return this._device; }

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
