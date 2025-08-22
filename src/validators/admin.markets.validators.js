import Joi from "joi";
import { HHMM } from "../utils/markets.js";

const perDaySchema = Joi.object({
  timetype: Joi.string().valid("open","close").required(),
  open: Joi.string().pattern(HHMM).when("timetype", { is: "open", then: Joi.required(), otherwise: Joi.optional() }),
  close: Joi.string().pattern(HHMM).when("timetype", { is: "open", then: Joi.required(), otherwise: Joi.optional() })
});

export const createMarketSchema = Joi.object({
  body: Joi.object({
    market: Joi.string().trim().max(255).required(),
    open: Joi.string().pattern(HHMM).required(),
    close: Joi.string().pattern(HHMM).required(),
    sort_no: Joi.number().integer().min(0).default(0),
    perDay: Joi.object().pattern(
      Joi.string().valid("SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"),
      perDaySchema
    ).default({})
  })
});

export const updateMarketSchema = Joi.object({
  body: Joi.object({
    open: Joi.string().pattern(HHMM).optional(),
    close: Joi.string().pattern(HHMM).optional(),
    sort_no: Joi.number().integer().min(0).optional(),
    perDay: Joi.object().pattern(
      Joi.string().valid("SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"),
      perDaySchema
    ).optional()
  })
});

export const patchActiveSchema = Joi.object({
  body: Joi.object({
    active: Joi.string().valid("0","1").required()
  })
});
