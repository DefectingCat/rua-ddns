import schedule from 'node-schedule';
import config from '../config.js';
import { addRecord, getIp, listRecords } from './ddns.js';

let lastIp = '';

const updateRecord = async () => {
    const list = await listRecords({
        domain: config.domain,
        sub_domain: `${config.subDomain}.${config.domain}`,
    });

    if (list.status.code === '10') {
        // add
        const result = await addRecord({
            domain: config.domain,
            sub_domain: `${config.subDomain}.${config.domain}`,
            record_line: '默认',
            record_type: config.netType === 'inet6' ? 'AAAA' : 'A',
            value: lastIp,
        });
        if (result.status.code === '1')
            console.log(
                `Add DNS record ${config.subDomain}.${config.domain} to ${lastIp} success!`
            );
    } else {
        // modify
    }
};
const callback = async () => {
    const ip = await getIp();

    if (lastIp === ip) {
    } else {
        lastIp = ip;
    }
};
