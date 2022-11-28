import schedule from 'node-schedule';
import config from '../config.js';
import store, { ClientStatus } from '../store.js';
import { addRecord, listRecords, modifyRecord } from './ddns.js';
import logger from './logger.js';
import io from './socket.js';

const updateRecord = async () => {
    const props = {
        domain: config.domain,
        sub_domain: config.subDomain,
        record_line: '默认',
        record_type:
            config.netType === 'inet6' ? 'AAAA' : ('A' as 'A' | 'AAAA'),
        value: store.lastIp,
    };

    if (!store.list) {
        store.list = await listRecords({
            domain: config.domain,
            sub_domain: config.subDomain,
        });
    }
    if (store.list.status.code === '10  ') {
        // add
        logger(`Starting add new record.`);
        const result = await addRecord(props);
        logger(props, result);
        if (result.status.code === '1') {
            logger(
                `Add DNS record ${config.subDomain}.${config.domain} to ${store.lastIp} success!`
            );
        } else {
            console.error(result);
            throw new Error(result.status.message);
        }
    } else {
        // update
        const result = await modifyRecord({
            ...props,
            record_id: store.list.records[0].id,
        });
        logger(props, result);
        if (result.status.code === '1') {
            logger(
                `Update DNS record ${config.subDomain}.${config.domain} to ${store.lastIp} success!`
            );
        } else {
            console.error(result);
            throw new Error(result.status.message);
        }
    }
};

export const callback = async (ip: string) => {
    if (!ip) throw new Error('Can not get system ip address!');

    if (store.lastIp === ip) return logger(`Ip not changed.`);

    // Double check.
    store.list = await listRecords({
        domain: config.domain,
        sub_domain: config.subDomain,
    });

    store.lastIp = ip;
    if (store.list?.records.length) {
        const notChanged = store.list.records.find(
            (record) => record.value === ip
        );
        if (notChanged) {
            return logger(
                `Record address not changed. Current ip: ${store.lastIp} record ip: ${notChanged.value}`
            );
        }
    }

    logger(`Ip has changed, string update Record.`);
    await updateRecord();
};

export const recordJob = async () => {
    if (store.client === ClientStatus.Connected) {
        logger(`Starting check ip address.`);
        // const ip = await getIp();
        io.emit('getIp');
    } else {
        logger(`Agent is not connected.`);
    }
};

export const scheduleDDNS = () => {
    // call job immediatly
    recordJob();
    schedule.scheduleJob('*/1 * * * *', recordJob);
};
