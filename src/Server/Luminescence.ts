import { Express, Response } from 'express';
import DMXController from './DMX/DMXController';
import { getOrThrow } from './Payloads/In/Payload';
import { SetDimmer } from './Payloads/In/Dimmer';
import Config from './Config/Config';

import * as usb from 'usb';
import uDMX from './DMX/Adapters/uDMX';
import DMXAdapter from './DMX/Adapters/DMXAdapter';
import EnttecOpenDMX from './DMX/Adapters/EnttecOpenDMX';
import { OutboundPayload } from './Payloads/PayloadBasee';
import { StatusPayload } from './Payloads/Out/Status';

export default class Luminescence {

    private _adapter: DMXAdapter;
    private _controller: DMXController;

    private readonly DMX_ADAPTERS = [
        EnttecOpenDMX, uDMX
    ];

    public constructor() {
        const config = new Config();
        config.loadFromFilesystem();

        this._controller = new DMXController(config.system);

        this.findAdapter();
        this.watchUSB();
    }

    public configureEndpoints(express: Express): void {
        express.route('/dimmer')
            .post((req, res) => {
                const payload = getOrThrow<SetDimmer>(['addr'], ['levels', 'aliases'], req.body);

                if (payload.levels) this._controller.dimmers.setLevel(payload.addr, payload.levels);
                if (payload.aliases) this._controller.dimmers.setAlias(payload.addr, payload.aliases);

                res.sendStatus(204);
            })
            .get((req, res) => {

            }
        );

        express.route('/status')
            .get((req, res) => {
                Luminescence.sendResponse<StatusPayload>(res, {
                    adapter: this._adapter ? this._adapter.constructor.name : null
                });
            }
        );
    }

    // TODO: Make this actually typesafe and not allow duck typing.
    private static sendResponse<T extends OutboundPayload>(res: Response, payload: T): void {
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
