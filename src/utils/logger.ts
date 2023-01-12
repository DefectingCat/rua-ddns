const logger = (...message: unknown[]) => {
    const now = new Date().toISOString();
    console.log(`${now} -`, ...message);
};

export default logger;
