import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';

import 'Util/ArrayUtil';
import './Config/Config';

import * as fs from 'fs';
import * as usb from 'usb';
import { Device } from 'usb';
import uDMX from './DMX/Adapters/uDMX';
import Luminescence from './Luminescence';

// console.log(uDMX);


const wwwDir = path.join(__dirname, '../www/');

type SystemConfig = {
    adapters: Array<{
        name: string,
        vendorId: number,
        productId: number
    }>,
    dmx: {
        idleSendRate: number
    }
}

async function init() {


    const server = express();
    const luminescence: Luminescence = new Luminescence();

    // Non-errors
    server.use(morgan('\x1b[37m[:date[iso]]\x1b[0m \x1b[32m:status\x1b[0m :method :url', {
        skip: (req, res) => res.statusCode >= 400
    }));
    // Errors
    server.use(morgan('\x1b[37m[:date[iso]]\x1b[0m \x1b[31m:status :method :url\x1b[0m', {
        skip: (req, res) => res.statusCode < 400
    }));

    server.use(express.static(wwwDir));

    luminescence.configureEndpoints(server);

    // server.get('/', (req, res) => {
    //     res.sendFile(path.join(wwwDir, 'index.html'));
    // });

    server.listen(3000, () => console.log('Server started. Listening on port 3000'));

    // const deviceLookup: SystemConfig = JSON.parse(fs.readFileSync('./data/system.json').toString('utf8'));
    //
    // if (!deviceLookup.adapters || deviceLookup.adapters.length == 0) {
    //     console.warn('system.json - No USB adapters registered to look for!');
    //     process.exit(1);
    // }
    //
    // let device: Device;
    //
    // console.log('Searching for adapters...');
    // for (const adapter of deviceLookup.adapters) {
    //     device = usb.findByIds(adapter.vendorId, adapter.productId);
    //     if (device) {
    //         console.log(`Adapter found: ${adapter.name}`);
    //         break;
    //     }
    // }
    //
    // if (!device) {
    //     console.error('Unable to find USB adapter.');
    //     process.exit(2);
    // }
    //
    //
    // const adapter = new uDMX(device);
    // console.log('Open');
    // adapter.open();
    // await sleep(1000);
    // console.log('Sending');
    // adapter.setAddress(15, 0);
    // adapter.sendDMX();
    // await sleep(1000);
    // console.log('Sleeping');
    // adapter.close();
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

init();
