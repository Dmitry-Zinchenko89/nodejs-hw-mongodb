import { Contact } from "../model/contacts.js";

export const getContacts = async (req, res) => {
    const contacts = await Contact.find();
    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};

export const getContacBytId = async (req, res) => {
    const { contactId } = req.params
    const contact = await Contact.findById(contactId);

    if (!contact) {
        throw createError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

export const createContactController = async (req, res) => {
    const contact = await createContact(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact,
    })
};

export const patchContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const updateData = req.body;

        const updatedContact = await updatedContact(contactId, updateData);

        if (!updatedContact) {
            throw createError(404, 'Contact not found');
        }

        res.status(200).json({
            status: 200,
            message: 'Successfully patched a contact!',
            data: updatedContact,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const deletedContact = await removeContactById(contactId);

        if (!deletedContact) {
            throw createError(404, 'Contact not found');
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};