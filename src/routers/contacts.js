import { Router } from "express";
import {
    getContacts,
    getContacBytId,
    createContactController,
    patchContactById,
    deleteContactById
} from "../controllers/contacts.js";

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContacts));

contactsRouter.get('/contacts/:contactId', ctrlWrapper(getContacBytId));

contactsRouter.post('/contacts', ctrlWrapper(createContactController));

contactsRouter.patch('/contacts/:contactId', ctrlWrapper(patchContactById));

contactsRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactById));



export default contactsRouter;