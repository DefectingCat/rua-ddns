import schedule from 'node-schedule';
import { addRecord, listRecords, modifyRecord } from './ddns';
import logger from './logger';
import store from './store';
import { getIp } from './ip';

const updateRecord = async () => {
    const { config, lastIp } = store;
    if (!config) throw Error('Can not get config.');
    const props = {
        domain: config.domain,
        sub_domain: config.subDomain,
        record_line: '默认',
        record_type:
            config.netType === 'inet6' ? 'AAAA' : ('A' as 'A' | 'AAAA'),
        value: lastIp,
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

export const callback = async () => {
    logger(`Starting jobs.`);
    const ip = await getIp();
    if (!ip) throw new Error('Can not get system ip address!');

    const { config } = store;
    if (!config) throw Error('Can not get config.');
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

export const scheduleDDNS = () => {
    // Call job immediately
    try {
        callback();
        schedule.scheduleJob('*/1 * * * *', callback);
    } catch (err) {
        logger(err);
    }
};
