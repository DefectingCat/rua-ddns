import { Config } from '../types/config';
import { readConfig, validateConfig } from './config';
import logger from './logger';

export type Store = {
    config: Config | null;
};

const store: Store = {
    config: null,
};

export const initStore = async () => {
    const config = await readConfig();
    const result = validateConfig(config);
    if (!result || !result.valid) return;
    store.config = result.content;
    logger('Config init succeed.');
};

export default store;
