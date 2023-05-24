import joi from "joi";

export const signUpSchema = joi.object({
    name: joi.string().min(1).required(),
    email: joi.string().min(1).email().required(),
    photo: joi.string(),
    biography: joi.string(),
    password: joi.string().min(3).required(),
    confirmPassword: joi.string().min(3).valid(joi.ref('password')).required()
});

export const signInSchema = joi.object({
    email: joi.string().email().min(1).required(),
    password: joi.string().min(3).required()
});