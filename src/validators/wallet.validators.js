import Joi from "joi";

export const addFundsSchema = Joi.object({
  body: Joi.object({
    amount: Joi.number().integer().min(1).required(),
    method: Joi.string().valid("MANUAL","Razorpay","Added By Admin").required()
  })
});
