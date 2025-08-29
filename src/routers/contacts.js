import { Router } from "express";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
    getContacts,
    getContactById,
    createContactController,
    updateContactById,
    deleteContactById
} from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactsSchema } from '../validation/createContactsSchema .js';
import { updateContactsSchema } from '../validation/updateContactsSchema.js';
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContacts));

contactsRouter.get('/contacts', ctrlWrapper(getContacts));

contactsRouter.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactById));

contactsRouter.post('/contacts', validateBody(createContactsSchema), ctrlWrapper(createContactController));

contactsRouter.patch('/contacts/:contactId', isValidId, validateBody(updateContactsSchema), ctrlWrapper(updateContactById));

contactsRouter.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactById));



export default contactsRouter;