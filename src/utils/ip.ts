import { exec } from 'child_process';
import store from './store';

export const getIp = async () => {
    const { config } = store;
    if (!config) throw Error('Can not get config.');
    const showV6 = `ip -6 add show ${config.devName} | grep "${config.netType}" | grep "scope global dynamic noprefixroute"`;
    const showV4 = `ip add show ${config.devName} | grep "${config.netType}" | grep "scope global"`;
    const map: {
        [key in string]: string;
    } = {
        inet4: showV4,
        inet6: showV6,
    };
    return new Promise((resolve, reject) => {
        exec(map[config.netType], (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }

            const ip = stdout;
            switch (config.netType) {
                case 'inet6': {
                    const address = ip.split('\n').map(
                        (item) =>
                            item
                                .split('scope')
                                .map((text) => text.trim())[0]
                                .split(' ')[1]
                    );
                    resolve(address[0]?.split('/')[0]);
                    break;
                }
                /**
                 * @TODO Add ipv4 support.
                 */
                case 'inet': {
                    resolve(ip);
                    break;
                }
                default: {
                    reject(`Wrong network type: ${config.netType}`);
                }
            }
        });
    });
};
