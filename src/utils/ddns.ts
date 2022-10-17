import http from './axios.js';
import { config } from 'dotenv';

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
/**
 * https://docs.dnspod.cn/api/record-list/
 */
export const listRecords = async (params: ListRecordsParams) => {
    const result = await http.post(
        '/Record.List',
        new URLSearchParams({
            ...commonParams,
            ...params,
        })
    );
    return result.data;
};
