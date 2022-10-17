import schedule from 'node-schedule';
import config from '../config.js';
import { addRecord, getIp, listRecords } from './ddns.js';
import logger from './logger.js';

let lastIp = '';

const updateRecord = async () => {
    const list = await listRecords({
        domain: config.domain,
        sub_domain: `${config.subDomain}.${config.domain}`,
    });

    if (list.status.code === '10') {
        // add
        logger(`Starting add new record.`);
        const result = await addRecord({
            domain: config.domain,
            sub_domain: `${config.subDomain}.${config.domain}`,
            record_line: '默认',
            record_type: config.netType === 'inet6' ? 'AAAA' : 'A',
            value: lastIp,
        });
        logger(
            {
                domain: config.domain,
                sub_domain: `${config.subDomain}.${config.domain}`,
                record_line: '默认',
                record_type: config.netType === 'inet6' ? 'AAAA' : 'A',
                value: lastIp,
            },
            result
        );
        if (result.status.code === '1') {
            logger(
                `Add DNS record ${config.subDomain}.${config.domain} to ${lastIp} success!`
            );
        } else {
            console.error(result);
            throw new Error(result.status.message);
        }
    } else {
    }
};

export const callback = async () => {
    logger(`Starting check ip address.`);
    const ip = await getIp();

    if (!ip) throw new Error('Can not get system ip address!');

    if (lastIp === ip) {
        logger(`Ip not changed.`);
    } else {
        logger(`Ip has changed, string update Record.`);
        lastIp = ip;
        await updateRecord();
    }
};
