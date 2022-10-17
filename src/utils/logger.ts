const now = new Date().toISOString();

const logger = (...message: unknown[]) => console.log(`${now} -`, ...message);

export default logger;
