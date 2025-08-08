import express from "express";
import pino from "pino-http";
import cors from "cors";
import { ENV_VARS } from "./utils/envVars.js";
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js'
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const setupServer = () => {
    const app = express();
    const PORT = getEnvVar(ENV_VARS.PORT, 3000);


    app.use(pino());
    app.use(cors());

    app.use(contactsRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
