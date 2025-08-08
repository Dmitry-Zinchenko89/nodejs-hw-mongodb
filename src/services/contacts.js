import Contact from '../model/contacts.js'

export const createContact = async (payload) => {
    const contact = await Contact.create(payload);
    return contact;
};

export const updateContactById = async (contactId, updateData) => {
    const updated = await Contact.findByIdAndUpdate(contactId, updateData, {
        new: true,
        runValidators: true
    });

    return updated;
};

export const removeContactById = async (contactId) => {
    const deleted = await Contact.findByIdAndDelete(contactId);
    return deleted;
};

