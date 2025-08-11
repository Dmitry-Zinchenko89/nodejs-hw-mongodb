import { Router } from "express";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
    getContacts,
    getContacBytId,
    createContactController,
    updateContactById,
    deleteContactById
} from "../controllers/contacts.js";

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContacts));

contactsRouter.get('/contacts/:contactId', ctrlWrapper(getContacBytId));

contactsRouter.post('/contacts', ctrlWrapper(createContactController));

contactsRouter.patch('/contacts/:contactId', ctrlWrapper(updateContactById));

contactsRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactById));



export default contactsRouter;