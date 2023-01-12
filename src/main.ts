import { initStore } from './utils/store';
import logger from './utils/logger';
import { getIp } from './utils/ip';

const main = async () => {
    await initStore();
    const ip = await getIp();
    console.log(ip);
};

main().then(() => logger('Started.'));
