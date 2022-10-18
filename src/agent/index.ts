import { io } from 'socket.io-client';
import logger from '../utils/logger.js';
import config from '../config.js';
import { getIp } from '../utils/ddns.js';
import 'zx/globals';

const serverAdd = `http://localhost:${config.socketPort}`;
const socket = io(serverAdd);

logger(`Starting connect to server. ${serverAdd}`);
socket.on('pong', logger);

socket.on('getIp', async () => {
    const ip = await getIp();
    logger(`Get ip address ${ip}`);
    socket.emit('sentIp', ip);
});
