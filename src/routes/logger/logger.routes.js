import { Router } from "express";

const loggerRouter = Router();

loggerRouter.get('/', async (req, res) => {
    try {
        req.logger.fatal({ errorLevel: 0, message: 'Test logger fatal' });
        req.logger.error({ errorLevel: 1, message: 'Test logger error' });
        req.logger.warning({ errorLevel: 2, message: 'Test logger warning' });
        req.logger.info({ errorLevel: 3, message: 'Test logger info' });
        req.logger.http({ errorLevel: 4, message: 'Test logger http' });
        req.logger.debug({ errorLevel: 5, message: 'Test logger debug' });
        res.status(200).send('Logger test complete')
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    };
});

export default loggerRouter;