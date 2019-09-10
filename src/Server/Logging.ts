import * as winston from 'winston';

const levels = {
    levels: {
        always: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4
    },
    colors: {
        always: 'grey',
        error: 'red',
        warn: 'yellow',
        info: 'info',
        debug: 'grey'
    }
}

export const Log = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: 'logs/server.log' }),
        new winston.transports.File({ filename: 'logs/server.error.log', level: 'error' }),
        new winston.transports.Console()
    ],
    levels: levels.levels,
});

winston.addColors(levels.colors);
