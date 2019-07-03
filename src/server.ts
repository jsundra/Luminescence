import * as fs from 'fs';
import * as usb from 'usb';
import { Device } from 'usb';
import uDMX from './DMXAdapters/uDMX';

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
    const deviceLookup: SystemConfig = JSON.parse(fs.readFileSync('./data/system.json').toString('utf8'));

    if (!deviceLookup.adapters || deviceLookup.adapters.length == 0) {
        console.warn('system.json - No USB adapters registered to look for!');
        process.exit(1);
    }

    let device: Device;

    console.log('Searching for adapters...');
    for (const adapter of deviceLookup.adapters) {
        device = usb.findByIds(adapter.vendorId, adapter.productId);
        if (device) {
            console.log(`Adapter found: ${adapter.name}`);
            break;
        }
    }

    if (!device) {
        console.error('Unable to find USB adapter.');
        process.exit(2);
    }


    const adapter = new uDMX(device);
    console.log('Open');
    adapter.open();
    await sleep(1000);
    console.log('Sending');
    adapter.setAddress(15, 255);
    adapter.sendDMX();
    await sleep(1000);
    console.log('Sleeping');
    adapter.close();
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

init();
