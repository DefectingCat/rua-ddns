import { ListRecords } from 'utils/ddns.js';

export const enum ClientStatus {
    Connected,
    NotConnected,
}

export type Store = {
    lastIp: string;
    list: null | ListRecords;
    client: ClientStatus;
};

/*
 * Global variables.
 */
const store: Store = {
    // System last ip address.
    lastIp: '',
    // DNS recored list.
    list: null,
    // Client connection status
    client: ClientStatus.NotConnected,
};

export default store;
