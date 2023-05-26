import joi from "joi";


export const commentsSchema = joi.object({
    postId: joi.number().required(),
    comment: joi.string().min(1).required()
});