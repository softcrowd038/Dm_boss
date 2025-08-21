import Joi from "joi";

export const placeBetSchema = Joi.object({
  body: Joi.object({
    game: Joi.string().max(22).required(),
    bazar: Joi.string().max(55).required(),
    date: Joi.string().max(22).required(),
    number: Joi.string().max(255).required(),
    amount: Joi.number().integer().min(1).required(),
    game_type: Joi.string().max(50).optional()
  })
});
