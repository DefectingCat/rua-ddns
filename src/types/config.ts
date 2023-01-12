export type Config = {
    // Network device name: 'enp2s0'
    devName: string;
    // inet | inet6
    netType: string;
    domain: string;
    subDomain: string;
    // listen port
    port: number;
};

export const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://example.com/product.schema.json',
    title: 'RUA config',
    description: 'Config file for rua-ddns',
    type: 'object',
    properties: {
        devName: {
            description: 'Network device name',
            type: 'string',
        },
        netType: {
            description: 'Network type.',
            type: 'string',
        },
        domain: {
            description: 'DNS domain',
            type: 'string',
        },
        subDomain: {
            description: 'DNS sub-domain',
            type: 'string',
        },
        port: {
            description: '',
            type: 'integer',
        },
    },
    required: ['devName', 'netType', 'domain', 'subDomain'],
};
