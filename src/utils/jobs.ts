import schedule from 'node-schedule';
import config from '../config.js';
import {
    addRecord,
    getIp,
    ListRecords,
    listRecords,
    modifyRecord,
} from './ddns.js';
import logger from './logger.js';

let lastIp = '';
let list: null | ListRecords = null;

const updateRecord = async () => {
    const props = {
        domain: config.domain,
        sub_domain: config.subDomain,
        record_line: '默认',
        record_type:
            config.netType === 'inet6' ? 'AAAA' : ('A' as 'A' | 'AAAA'),
        value: lastIp,
    };

    if (!list) {
        list = await listRecords({
            domain: config.domain,
            sub_domain: config.subDomain,
        });
    }
    if (list.status.code === '10  ') {
        // add
        logger(`Starting add new record.`);
        const result = await addRecord(props);
        logger(props, result);
        if (result.status.code === '1') {
            logger(
                `Add DNS record ${config.subDomain}.${config.domain} to ${lastIp} success!`
            );
        } else {
            console.error(result);
            throw new Error(result.status.message);
        }
    } else {
        // update
        const result = await modifyRecord({
            ...props,
            record_id: list.records[0].id,
        });
        logger(props, result);
        if (result.status.code === '1') {
            logger(
                `Update DNS record ${config.subDomain}.${config.domain} to ${lastIp} success!`
            );
        } else {
            console.error(result);
            throw new Error(result.status.message);
        }
    }
};

export const recordJob = async () => {
    logger(`Starting check ip address.`);
    const ip = await getIp();

    if (!ip) throw new Error('Can not get system ip address!');

    if (lastIp === ip) return logger(`Ip not changed.`);

    // Double check.
    list = await listRecords({
        domain: config.domain,
        sub_domain: config.subDomain,
    });

    lastIp = ip;
    if (list?.records.length) {
        const notChanged = list.records.find((record) => record.value === ip);
        if (notChanged) {
            return logger(
                `Record address not changed. Current ip: ${lastIp} record ip: ${notChanged.value}`
            );
        }
    }

    logger(`Ip has changed, string update Record.`);
    await updateRecord();
};

export const scheduleDDNS = () => {
    // call job immediatly
    recordJob();
    schedule.scheduleJob('*/1 * * * *', recordJob);
};