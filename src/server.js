import express from "express";
import pino from "pino-http";
import cors from "cors";
import { ENV_VARS } from "./utils/envVars.js";
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js'
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.js";
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

export const setupServer = () => {
    const app = express();
    const PORT = getEnvVar(ENV_VARS.PORT, 3000);


    app.use(pino());
    app.use(cors());

    app.use(express.json());
    app.use(cookieParser());

    app.use('/api-docs', swaggerDocs());
    app.use('/auth', authRouter);
    app.use('/contacts', contactsRouter);
    app.use('/uploads', express.static(UPLOAD_DIR));


    app.use(notFoundHandler);
    app.use(errorHandler);



    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
