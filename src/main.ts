import store, { initStore } from './utils/store';
import logger from './utils/logger';
import { getIp } from './utils/ip';

const main = async () => {
    await initStore();
    console.log(store.config);
    getIp();
};

main().then(() => logger('Started.'));
