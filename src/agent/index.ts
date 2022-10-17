import { io } from 'socket.io-client';
import logger from '../utils/logger.js';
import config from '../config.js';

const socket = io(`http://localhost:${config.port - 1}`);

socket.on('pong', logger);
