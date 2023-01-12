import fs from 'fs';
import path from 'path';
import logger from './logger';

const filename = 'config.json';
const filePath = path.resolve('./', filename);

const readConfig = async () => {
    logger(`Starting read config file ${filePath}.`);
    const configFile = await fs.promises.readFile(filePath, {
        encoding: 'utf-8',
    });
};
