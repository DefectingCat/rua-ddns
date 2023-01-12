import { exec } from 'child_process';
import store from './store';

export const getIp = () => {
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

    exec(map[config.netType], (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
};
