import DMXAdapter from './DMXAdapter';
import { spawn, ChildProcessWithoutNullStreams} from 'child_process'

// References
//  DMX Protocol: https://en.wikipedia.org/wiki/DMX512#Protocol
//  Enttec's examples: https://www.enttec.com/product/controls/dmx-usb-interfaces/open-dmx-usb/

export default class EnttecOpenDMX extends DMXAdapter {

    public static readonly NAME: string = 'Enttec Open DMX USB';
    public static readonly VENDOR_ID: number = 1027;
    public static readonly PRODUCT_ID: number = 24577;

    private _serialProc: ChildProcessWithoutNullStreams;
    private _buffer: Buffer;

    public open(): void {
        this._buffer = Buffer.alloc(this._maxAddr);

        this._serialProc = spawn(`SerialDMX.exe`, [EnttecOpenDMX.VENDOR_ID.toString(16), EnttecOpenDMX.PRODUCT_ID.toString(16), `${this._maxAddr}`]);
        this._serialProc.on('error', err => console.error(`SerialDMX process error: ${err}`));
        this._serialProc.stderr.on('data', err => console.error(`SerialDMX process error: ${err}`));
        this._serialProc.stdout.on('data', data => console.log(`SerialDMX: ${data}`));
    }

    public close(): void {
        // super.close();
    }

    public sendDMX(dmx: number[]): void {
        for (const i in dmx) {
            this._buffer[i] = dmx[i];
        }
        this._serialProc.stdin.write(this._buffer);
    }
}
