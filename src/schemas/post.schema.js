import joi from "joi";

export const postImageSchema = joi.object({
    photo: joi.string().min(3).required(),
    description: joi.string().min(3).required()
});