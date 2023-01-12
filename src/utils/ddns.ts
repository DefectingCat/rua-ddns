import { config } from 'dotenv';
import http from './axios';

config();

const id = process.env.DNSPOD_ID;
const token = process.env.DNSPOD_TOKEN;

const commonParams = {
    login_token: `${id},${token}`,
    format: 'json',
};

type ListRecordsProps = {
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
export interface ListRecords extends CommonReturn {
    records: RecordList[];
}
export interface RecordList {
    id: string;
    ttl: string;
    value: string;
    enabled: string;
    status: string;
    updated_on: Date;
    name: string;
    line: string;
    line_id: string;
    type: string;
    weight: null;
    monitor_status: string;
    remark: string;
    use_aqb: string;
    mx: string;
}
/**
 * https://docs.dnspod.cn/api/record-list/
 */
export const listRecords = async (props: ListRecordsProps) => {
    const result = await http.post<ListRecords>(
        '/Record.List',
        new URLSearchParams({
            ...commonParams,
            ...props,
        })
    );
    return result.data;
};

type AddProps = {
    record_type: 'A' | 'AAAA';
    record_line: string | '默认';
    value: string;
} & ListRecordsProps;
export const addRecord = async (props: AddProps) => {
    const result = await http.post<CommonReturn>(
        '/Record.Create',
        new URLSearchParams({
            ...commonParams,
            ...props,
        })
    );
    return result.data;
};

type ModifyProps = {
    record_id: string;
} & AddProps;
export const modifyRecord = async (props: ModifyProps) => {
    const result = await http.post<CommonReturn>(
        '/Record.Modify',
        new URLSearchParams({
            ...commonParams,
            ...props,
        })
    );
    return result.data;
};
