import Joi from "joi";

export const createContactsSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(3).max(20).required(),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().min(3).max(20)
        .valid('work', 'home', 'personal')
        .default('personal')
        .required(),
});