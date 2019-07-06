import DMXAdapter from './DMXAdapter';
import * as usb from 'usb';

const bmRequestType: number = usb.LIBUSB_ENDPOINT_OUT | usb.LIBUSB_RECIPIENT_ENDPOINT | usb.LIBUSB_REQUEST_TYPE_VENDOR;
const SET_CHANNEL_SINGLE: number = 1;
const SET_CHANNEL_RANGE: number = 2;

export default class uDMX extends DMXAdapter {

    sendDMX(): void {
        // for (const addr in this._dmx) {
        //     console.log(`Setting ${addr} @ ${this._dmx[addr]}`);
        //
        //     const buffer = new Buffer(1);
        //     buffer[0] = 255;
        //
        //     this._device.controlTransfer(bmRequestType, SET_CHANNEL_SINGLE, this._dmx[addr],
        //         parseInt(addr), buffer, (e, buf) => {
        //             // TODO: Debug the hell out of this. DMX still sends, but this invokes with undefined.
        //             // Related to the fact that DMX doesn't emit if not pushed with a high address?
        //             console.error(`Error sending dmx: ${e} - ${buf}`);
        //     });
        // }
    }
}
