import express from "express";
import pino from "pino-http";
import cors from "cors";
import { ENV_VARS } from "./utils/envVars.js";
import { getEnvVar } from './utils/getEnvVar.js';
import { Contact } from "./services/contacts.js";

export default function setupServer() {

    const PORT = getEnvVar(ENV_VARS.PORT, 3000);
    const app = express();

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        }),
    );

    app.use(cors());

    app.get('/contacts', async (req, res) => {
        const contacts = await Contact.find();
        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts,
        });
    });

    app.get('/contacts/:contactId', async (req, res) => {
        const { contactId } = req.params
        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json({
                status: 404,
                message: 'Contact not found',

            });

        }
        res.json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            message: 'Not found',
        });
    });


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}
