import http from './axios.js';
import { config } from 'dotenv';
import projectConfig from '../config.js';

config();

const id = process.env.DNSPOD_ID;
const token = process.env.DNSPOD_TOKEN;

const commonParams = {
    login_token: `${id},${token}`,
    format: 'json',
};

type ListRecordsParams = {
    domain: string;
    sub_domain?: string;
};
type CommonReturn = {
    status: {
        code: string;
        message: string;
        created_at: Date;
    };
};
/**
 * https://docs.dnspod.cn/api/record-list/
 */
export const listRecords = async (params: ListRecordsParams) => {
    const result = await http.post<CommonReturn>(
        '/Record.List',
        new URLSearchParams({
            ...commonParams,
            ...params,
        })
    );
    return result.data;
};

type AddParams = {
    record_type: 'A' | 'AAAA';
    record_line: string | '默认';
    value: string;
} & ListRecordsParams;
export const addRecord = async (params: AddParams) => {
    const result = await http.post<CommonReturn>(
        '/Record.Create',
        new URLSearchParams({
            ...commonParams,
            ...params,
        })
    );
    return result.data;
};

export const showV6 = `ip -6 add show ${projectConfig.devName} | grep "${projectConfig.netType}" | grep "scope global dynamic noprefixroute"`;
export const showV4 = `ip add show ${projectConfig.devName} | grep "${projectConfig.netType}" | grep "scope global"`;
export const getIp = async () => {
    switch (projectConfig.netType) {
        case 'inet6': {
            const ip = (
                await $`ip -6 add show ${projectConfig.devName} | grep "${projectConfig.netType}" | grep "scope global dynamic noprefixroute"`
            ).stdout;
            const address = ip.split('\n').map(
                (item) =>
                    item
                        .split('scope')
                        .map((text) => text.trim())[0]
                        .split(' ')[1]
            );
            const target = address
                .find((item) => item && !item.startsWith('fd'))
                ?.split('/')[0];
            return target;
        }
        /**
         * @TODO Add ipv4 support.
         */
        case 'inet': {
            const ip = (
                await $`ip add show ${projectConfig.devName} | grep "${projectConfig.netType}" | grep "scope global"`
            ).stdout;
            return ip;
        }
        default:
            throw new Error(`Wrong network type: ${projectConfig.netType}`);
    }
};
