import GametimeManual from "../models/gametimeManual.model.js";
import RateDisplay from "../models/rateDisplay.model.js";
import { ok } from "../utils/apiResponse.js";

export const listMarkets = async (req, res) => {
  const markets = await GametimeManual.find({ active: "1" }).sort({ sort_no: 1 }).lean();
  return ok(res, { markets });
};

export const getRates = async (req, res) => {
  const rates = await Rate.findOne().lean();
  return ok(res, { rates });
};

export const getPublicRates = async (req, res) => {
  let doc = await RateDisplay.findOne().lean();
  if (!doc) doc = (await RateDisplay.create({})).toObject();
  return ok(res, { rates: doc }, "OK");
};

