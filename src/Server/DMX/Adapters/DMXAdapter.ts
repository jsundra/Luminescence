import { Device } from 'usb';

export default abstract class DMXAdapter {

    public static readonly NAME: string;
    public static readonly PRODUCT_ID: number;
    public static readonly VENDOR_ID: number;

    protected _device: Device;
    protected _maxAddr: number;

    public get usbDevice(): Device { return this._device; }

    public constructor(device: Device) {
        this._device = device;
    }

    public abstract open(): void;

    public abstract close(): void;

    public setMaxAddr(addr: number): void {
        this._maxAddr = addr;
    }

    public abstract sendDMX(dmx: number[]): void;
}
