import { Contact } from '../model/contacts.js'

export const createContact = async (payload) => {
    const contact = await Contact.create(payload);
    return contact;
};

export const updateContact = async (contactId, payload) => {
    const contact = await Contact.findOneAndUpdate({ _id: contactId }, payload,
        { new: true },
    );

    return contact;
};

export const deleteContact = async (contactId) => {
    const contact = await Contact.findOneAndDelete({ _id: contactId });
    return contact;
};

