import Joi from "joi";

export const registerSchema = Joi.object({
  body: Joi.object({
    mobile: Joi.string().trim().max(20).required(),
    name: Joi.string().trim().max(255).required(),
    email: Joi.string().trim().email().optional(),
    password: Joi.string().min(6).max(100).required()
  })
});

export const loginSchema = Joi.object({
  body: Joi.object({
    mobile: Joi.string().trim().required(),
    password: Joi.string().required()
  })
});
