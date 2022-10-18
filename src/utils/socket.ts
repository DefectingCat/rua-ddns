import { createServer } from 'http';
import { Server } from 'socket.io';

export const httpServer = createServer();

const io = new Server(httpServer);

export default io;
