import mongoose from "mongoose";
import createError from "http-errors";
import { Contact } from "../model/contacts.js";
import { createContact } from '../services/contacts.js';
import { updateContact } from '../services/contacts.js';
import { deleteContact } from '../services/contacts.js';
import { getAllContacts } from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from '../utils/parseSortParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';





export const getContacts = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);

    const type = req.query.type;
    const isFavourite =
        typeof req.query.isFavourite !== "undefined"
            ? req.query.isFavourite === "true"
            : undefined;

    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        userId: req.user._id,
        type,
        isFavourite,
    });

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};

export const getContactById = async (req, res) => {
    const { contactId } = req.params

    if (!mongoose.isValidObjectId(contactId)) {
        throw createError(404, "Contact not found");
    }

    const contact = await Contact.findOne({
        _id: contactId,
        userId: req.user._id,
    });

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
    const file = req.file;
    let photoUrl;

    if (file) {
        photoUrl = await saveFileToCloudinary(file);
    }

    const payload = {
        ...req.body,
        ...(photoUrl && { photo: photoUrl }),
    };

    const contact = await createContact(payload, req.user._id);

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact,
    });
};

export const updateContactById = async (req, res,) => {
    const { contactId } = req.params;

    const file = req.file;
    let photoUrl;


    if (file) {
        photoUrl = await saveFileToCloudinary(file);
    }

    const payload = {
        ...req.body,
        ...(photoUrl && { photo: photoUrl }),
    };

    const contact = await updateContact(contactId, payload, req.user._id);
    if (!contact) {
        throw createError(404, 'Contact not found');
    }
    res.status(200).json({
        status: 200,
        message: 'Successfully updated a contact!',
        data: contact,
    });
};


export const deleteContactById = async (req, res) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId, req.user._id);

    if (!contact) {
        throw createError(404, 'Contact not found');
    }
    res.status(204).send();
};

