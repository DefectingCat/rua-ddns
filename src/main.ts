import express from 'express';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import winston from 'winston';
import 'zx/globals';
import helloRouter from './routes/hello.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import logger from './utils/logger.js';
import config from './config.js';
import './agent/index.js';

const { port } = config;
const socketPort = port - 1;
const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}
app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        ),
    })
);

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(helloRouter);

app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        ),
    })
);

app.listen(port, () => {
    logger(`Server running at http://localhost:${port}`);
});
httpServer.listen(socketPort, () => {
    logger(`Socker Server running at http://localhost:${socketPort}`);
});

io.on('connection', (socket) => {
    logger(`Socket client connect success! ${socket.id}`);
    socket.emit('pong', 'Connect success.');
});

// scheduleDDNS();

// Export default
export default app;
