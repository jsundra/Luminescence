import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';

import './Config/Config';

import Luminescence from './Luminescence';
import { Request, Response } from 'express';
import { PayloadError } from '../Common/Networking/Payloads/Payload';

const wwwDir = path.join(__dirname, '../www/');


async function init() {
    // http://patorjk.com/software/taag/#p=display&f=Ogre&t=Luminescence
    console.log(`\x1b[90m     __                 _                                         
    / / _   _ _ __ ___ (_)_ __   ___  ___  ___ ___ _ __   ___ ___ 
   / / | | | | '_ \` _ \\| | '_ \\ / _ \\/ __|/ __/ _ \\ '_ \\ / __/ _ \\
  / /__| |_| | | | | | | | | | |  __/\\__ \\ (_|  __/ | | | (_|  __/
  \\____/\\__,_|_| |_| |_|_|_| |_|\\___||___/\\___\\___|_| |_|\\___\\___|
                                                                \x1b[0m`);

    const server = express();
    const luminescence: Luminescence = new Luminescence();

    // Non-errors
    server.use(morgan('\x1b[90m[:date[iso]]\x1b[0m \x1b[32m:status\x1b[0m :method :url', {
        skip: (req, res) => res.statusCode >= 400
    }));
    // Errors
    server.use(morgan('\x1b[90m[:date[iso]]\x1b[0m \x1b[31m:status :method :url\x1b[0m', {
        skip: (req, res) => res.statusCode < 400
    }));

    server.use(express.json());

    server.use(express.static(wwwDir));

    luminescence.configureEndpoints(server);

    server.use((error: Error, req: Request, res: Response, next: any) => {
        if (error instanceof PayloadError) {
            res.status(400);
            res.json({
                error: {
                    type: error.constructor.name,
                    message: error.message,
                    // stack: error.stack
                }
            });
        } else {
            // TODO: Hide stack trace on production builds
            next(error);
        }
    });

    server.listen(3000, '0.0.0.0', () => console.log('Server started. Listening on port 3000.'));
}

// init();

import { spawn } from 'child_process';

const proc = spawn(`.\\dist\\node\\SerialDMX.exe`, [`COM7`, `24`]);
proc.stderr.on('data', data => console.error(`SerialDMX error: ${data}`));
proc.stdout.on('data', data => console.log(`SerialDMX log: ${data}`));
proc.stdout.on('', data => console.log(`SerialDMX log: ${data}`));
proc.on('error', error => {
    console.error(`SerialDMX process error: ${error}`)
});

var tmp = new Buffer(24);
for (var i = 0; i < tmp.length; i++) {
    tmp[i] = 255;
}

setTimeout(() => {
    proc.stdin.write(tmp);
}, 5000);

