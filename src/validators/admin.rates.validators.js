import Joi from "joi";
import { RATE_FIELDS } from "../utils/rates.js";

const shape = {};
for (const f of RATE_FIELDS) {
  shape[f] = Joi.number().positive().precision(6).required();
}

export const upsertRatesSchema = Joi.object({
  body: Joi.object(shape).required()
});
