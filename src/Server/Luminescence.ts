import { Express, Response } from 'express';
import DMXController from './DMX/DMXController';
import { getOrThrow } from 'Common/Networking/Payloads/Payload';
import Config from './Config/Config';

import * as usb from 'usb';
import uDMX from './DMX/Adapters/uDMX';
import DMXAdapter from './DMX/Adapters/DMXAdapter';
import EnttecOpenDMX from './DMX/Adapters/EnttecOpenDMX';
import FileSync from './Persistent/FileSync';
import { BoardData } from 'Common/BoardData';
import { StatusPayload } from 'Common/Networking/Payloads/Server';
import { SetDimmerPayload } from 'Common/Networking/Payloads/Client';

export default class Luminescence {

    private _adapter: DMXAdapter;
    private _controller: DMXController;

    private _data: BoardData;

    private readonly DMX_ADAPTERS = [
        EnttecOpenDMX, uDMX
    ];

    public constructor() {
        const config = new Config();
        config.loadFromFilesystem();

        const saveSrc = './data/board.json';
        const sync = new FileSync();
        this._data = sync.loadFromDisk(saveSrc);

        // TODO: Load from scene/user config
        this._data.dimmers.count = this._data.channels.count = 150;

        this._data.addListenerPersistent(() => {
            sync.saveToDisk(saveSrc, this._data);
        });

        this._controller = new DMXController(config.system, this._data);

        this.findAdapter();
        this.watchUSB();

        for (let i = 0; i < 150; i++) {
            this._controller.dimmers.setLevel(i, [0]);
        }

        // setInterval(() => {
        //     const dim = Math.round(Math.random() * 72) + 49;
        //     const val = this._data.dimmers.values[dim] === 255 ? 0 : 255;
        //     console.log(dim, val);
        //     this._controller.dimmers.setLevel(dim, [0]);
        // }, 50);
    }

    public configureEndpoints(express: Express): void {
        express.route('/status')
            .get((req, res) => {
                Luminescence.sendResponse<StatusPayload>(res, {
                    adapter: this._adapter ? this._adapter.constructor.name : null
                });
            }
        );

        express.route('/data')
            .get((req, res) => {
                res.json(this._data);
            }
        );

        express.route('/dimmer')
            .post((req, res) => {
                const payload = getOrThrow<SetDimmerPayload>(['addr'], ['levels', 'aliases'], req.body);

                if (payload.levels !== undefined) this._controller.dimmers.setLevel(payload.addr, Array.isArray(payload.levels) ? payload.levels : [payload.levels]);
                if (payload.aliases !== undefined) this._controller.dimmers.setAlias(payload.addr, Array.isArray(payload.aliases) ? payload.aliases : [payload.aliases]);

                res.sendStatus(204);
            }
        );
    }

    // TODO: Make this actually typesafe and not allow duck typing.
    private static sendResponse<T>(res: Response, payload: T): void {
        res.json(payload);
    }

    private setAdapter(adapter: Nullable<DMXAdapter>) {
        this._adapter = adapter;
        this._controller.setAdapter(this._adapter);
    }

    private findAdapter(): void {
        for (const Adapter of this.DMX_ADAPTERS) {
            const device = usb.findByIds(Adapter.VENDOR_ID, Adapter.PRODUCT_ID);
            if (device) {
                console.log(`Adapter found: ${Adapter.NAME}`);
                this.setAdapter(new Adapter(device));
                break;
            }
        }
    }

    private watchUSB(): void {

        // Listen for USB attach/detach events.
        usb.on('attach', (device) => {
            if (this._adapter) return;

            for (const Adapter of this.DMX_ADAPTERS) {
                if (device.deviceDescriptor.idVendor == Adapter.VENDOR_ID
                    && device.deviceDescriptor.idProduct == Adapter.PRODUCT_ID) {
                    this.setAdapter(new Adapter(device));
                }
            }
            console.log('USB attached. Not recognized as a DMX adapter.');
        });

        usb.on('detach', (device) => {
            if (this._adapter && device === this._adapter.usbDevice) {
                this.setAdapter(null);

                // Find a new adapter?
                // Maybe someone plugged in a new one and disconnected the current?
                this.findAdapter();
            }
        });
    }
}
