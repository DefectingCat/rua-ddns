import express from 'express';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import store, { ClientStatus } from './store.js';
import winston from 'winston';
import 'zx/globals';
import config from './config.js';
import helloRouter from './routes/hello.js';
import { callback, scheduleDDNS } from './utils/jobs.js';
import logger from './utils/logger.js';
import io, { httpServer } from './utils/socket.js';

const { port, socketPort } = config;
const app = express();

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

app.get('/', (_req, res) => {
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
    store.client = ClientStatus.Connected;
    logger(`Socket client connect success! ${socket.id}`);
    socket.emit('pong', 'Connect success.');
    socket.on('sentIp', (ip: string) => {
        logger(`Get ip address ${ip}`);
        try {
            callback(ip);
        } catch (err) {
            logger(err);
        }
    });
    scheduleDDNS();
});

// Export default
export default app;
