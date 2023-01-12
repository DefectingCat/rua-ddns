import fs from 'fs';
import path from 'path';
import logger from './logger';
import { Validator } from 'jsonschema';
import { schema } from '../types/config';

const filename = 'config.json';
const filePath = path.resolve('./', filename);
const v = new Validator();

export const validateConfig = (config?: string) => {
    try {
        logger(`Starting parse config content.`);
        if (!config) return logger(`Config content is empty ${config}`);
        const content = JSON.parse(config);
        return v.validate(content, schema);
    } catch (e) {
        console.error(e);
        logger(`Parse config file error: ${e}.`);
    }
};

export const readConfig = async () => {
    logger(`Starting read config file ${filePath}.`);
    try {
        return await fs.promises.readFile(filePath, {
            encoding: 'utf-8',
        });
    } catch (e) {
        console.error(e);
        logger(`Read config file error: ${filePath}.`);
    }
};
