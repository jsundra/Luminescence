import { Express } from 'express';
import DMXController from './DMX/DMXController';
import { getOrThrow } from './Payloads/In/Payload';
import { SetDimmer } from './Payloads/In/Dimmer';
import Config from './Config/Config';

export default class Luminescence {

    private _dmx: DMXController;

    public constructor() {
        const config = new Config();
        config.loadFromFilesystem();

        this._dmx = new DMXController(config.system);
    }

    public configureEndpoints(express: Express): void {
        express.route('/dimmer')
            .post((req, res) => {
                console.log('proc');

                const payload = getOrThrow<SetDimmer>(['addr'], ['level', 'alias'], req.body);

                if (payload.level) this._dmx.setDimmer(payload.addr, payload.level);
            }
        );
    }

}
