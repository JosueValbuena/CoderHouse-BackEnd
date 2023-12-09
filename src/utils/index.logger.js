import winston from 'winston';
import dotenv from 'dotenv';
dotenv.config();

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'black',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'white',
        debug: 'blue'
    }
};

winston.addColors(customLevels.colors);

const developLogger = winston.createLogger({
    levels: customLevels.levels,
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

const productionLogger = winston.createLogger({
    levels: customLevels.levels,
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'errors.log', level: 'error' })
    ]
});

export const logger = process.env.ENV === 'PRODUCTION' ? productionLogger : developLogger;