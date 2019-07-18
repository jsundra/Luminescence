import { Express, Response } from 'express';
import DMXController from './DMX/DMXController';
import { getOrThrow } from 'Common/Networking/Payloads/Payload';
import Config from './Config/Config';

import * as usb from 'usb';
import uDMX from './DMX/Adapters/uDMX';
import DMXAdapter from './DMX/Adapters/DMXAdapter';
import EnttecOpenDMX from './DMX/Adapters/EnttecOpenDMX';
import FileSync from './Persistent/FileSync';
import { BoardData, DimmerOwnership } from 'Common/BoardData';
import { StatusPayload } from 'Common/Networking/Payloads/Server';
import { AssignFixturePayload, SetDimmerPayload, SetParkPayload } from 'Common/Networking/Payloads/Client';
import { FixtureUtils } from '../Common/Fixtures/FixtureUtils';

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
        this._data.output.values.length = 150;

        this._data.addListenerPersistent(() => {
            sync.saveToDisk(saveSrc, this._data);
        });

        this._controller = new DMXController(config.system, this._data);

        this.findAdapter();
        this.watchUSB();

        for (let i = 0; i < 150; i++) {
            this._controller.setDimmerValue(i, DimmerOwnership.Relinquished);
        }

        // Verify this is needed
        // for (let i = 0; i < 150; i++) {
        //     this._controller.dimmers.setLevel(i, [0]);
        // }

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
                const payload = getOrThrow<SetDimmerPayload>(req.body, ['addr'], ['intensity', 'alias']);

                if (payload.intensity !== undefined) this._controller.dimmers.setLevel(payload.addr, payload.intensity);
                if (payload.alias !== undefined) this._controller.dimmers.setAlias(payload.addr, payload.alias);

                res.sendStatus(204);
            }
        );

        express.route('/park')
            .post((req, res) => {
                const payload = getOrThrow<SetParkPayload>(req.body, ['addr'], ['intensity']);

                this._controller.dimmers.setLevel(payload.addr, payload.intensity);

                res.sendStatus(204);
            }
        );

        express.route(`/channel/:action`)
            .post(((req, res) => {
                if (!req.params.action) {
                    res.status(400).send({error: 'Action required.'});
                }
                switch (req.params.action) {
                    case 'assign':
                        const payload = getOrThrow<AssignFixturePayload>(req.body, ['addr', 'type']);
                        console.log('Assigning fixture: ' + payload);
                        this._controller.channels.assignFixture(payload.addr, FixtureUtils.descriptorFromName(payload.type));
                        break;
                    case 'update':

                        break;
                    default:
                        res.status(400).send({error: 'Unknown action.'});
                        return;
                }
                res.sendStatus(204);
            })
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
                    console.log(`Adapter found: ${Adapter.NAME}`);
                    this.setAdapter(new Adapter(device));
                    return;
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
