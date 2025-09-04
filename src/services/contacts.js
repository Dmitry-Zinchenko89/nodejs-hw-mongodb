import { Contact } from '../model/contacts.js'
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const createContact = async (payload, userId) => {
    return Contact.create({ ...payload, userId });
};


export const updateContact = async (contactId, payload, userId) => {
    return Contact.findOneAndUpdate(
        { _id: contactId, userId },
        payload,
        { new: true }
    );
};

export const deleteContact = async (contactId, userId) => {
    const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
    return contact;
};

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    userId,
    type,
    isFavourite,
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const filter = { userId };


    if (type) filter.contactType = type;
    if (typeof isFavourite !== 'undefined') filter.isFavourite = isFavourite;


    const contactsQuery = Contact.find(filter);
    const contactsCount = await Contact.find(filter)
        .merge(contactsQuery)
        .countDocuments();

    const contacts = await contactsQuery
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec();

    const paginationData = calculatePaginationData(contactsCount, perPage, page);

    return {
        data: contacts,
        ...paginationData,
    };
};



