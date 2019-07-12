import DMXAdapter from './DMXAdapter';
import * as usb from 'usb';

const bmRequestType: number = usb.LIBUSB_ENDPOINT_OUT | usb.LIBUSB_RECIPIENT_ENDPOINT | usb.LIBUSB_REQUEST_TYPE_VENDOR;
const SET_CHANNEL_SINGLE: number = 1;
const SET_CHANNEL_RANGE: number = 2;

export default class uDMX extends DMXAdapter {

    public static readonly NAME: string = 'uDMX';
    public static readonly VENDOR_ID: number = 5824;
    public static readonly PRODUCT_ID: number = 1500;

    public open(): void {
        this._device.open();
    }

    public close(): void {
        this._device.close();
    }

    public sendDMX(dmx: number[]): void {
        // Ignore dmx[0].
        for (let addr = 1; addr < dmx.length; addr++) {
            let intensity = dmx[addr];
            if (intensity === undefined) continue;

            intensity = intensity / 100 * 255;

            const buffer = new Buffer(1);
            buffer[0] = 255;

            this._device.controlTransfer(bmRequestType, SET_CHANNEL_SINGLE, intensity,
                addr, buffer, (e, buf) => {
                    // TODO: Debug the hell out of this. DMX still sends, but this invokes with undefined.
                    // Related to the fact that DMX doesn't emit if not pushed with a high address?
                    if (e || buf) {
                        console.error(`Error sending dmx: ${e} - ${buf}`);
                    }
            });
        }
    }
}
