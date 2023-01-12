import store, { initStore } from './utils/store';
import logger from './utils/logger';

const main = async () => {
    await initStore();
    console.log(store);
};

main().then(() => logger('Started.'));
