import express from 'express';
import helmet from 'helmet';
import logger from 'jet-logger';
import winston from 'winston';
import expressWinston from 'express-winston';
import helloRouter from './routes/hello';

const app = express();
const port = 3000;

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
    logger.info(`Server running at ${port}`);
});

// Export default
export default app;
