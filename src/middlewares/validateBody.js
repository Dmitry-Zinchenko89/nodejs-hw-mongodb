import createHttpError from "http-errors";

export const validateBody = (schema) => async (req, res, next) => {
    try {
        const value = await schema.validateAsync(req.body, {
            allowUnknown: false,
            abortEarly: false,
            convert: false,
        });
        req.body = value;
        next();
    } catch (err) {
        if (err.details) {
            return res.status(400).json({
                status: 400,
                message: "Validation error",
                details: err.details.map(d => d.message),
            });
        }
        next(err);
    }
};