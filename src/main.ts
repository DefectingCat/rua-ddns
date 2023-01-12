import { initStore } from './utils/store';
import logger from './utils/logger';
import { scheduleDDNS } from './utils/jobs';

const main = async () => {
    await initStore();
};
const startJob = () => {
    logger('Server started.');
    scheduleDDNS();
};

main().then(startJob);
