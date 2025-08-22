import httpStatus from "http-status";
import RateNumeric from "../models/rateNumeric.model.js";
import RateDisplay from "../models/rateDisplay.model.js";
import { buildDisplayStrings, buildNormalized, RATE_FIELDS } from "../utils/rates.js";
import { ok } from "../utils/apiResponse.js"; // your helper
import LoginLog from "../models/loginLogs.model.js"; // we'll reuse as an activity log

function getClientInfo(req) {
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0] || req.socket?.remoteAddress || req.ip || "";
  const userAgent = req.headers["user-agent"] || "";
  return { ip, userAgent };
}

// GET /admin/rates -> return both numeric(normalized) + display
export const getRates = async (req, res) => {
  // single doc behavior
  const numeric = await RateNumeric.findOne().lean();
  const display = await RateDisplay.findOne().lean();

  // if first time, seed
  let numericDoc = numeric;
  let displayDoc = display;

  if (!numericDoc) {
    numericDoc = await RateNumeric.create({}); // defaults
  }
  if (!displayDoc) {
    displayDoc = await RateDisplay.create({}); // defaults
  }

  return ok(res, {
    numeric: numericDoc,
    display: displayDoc
  }, "OK");
};

// POST /admin/rates -> update both
// Body must contain numbers per-10 (e.g., { single: 95, jodi: 950, ... })
export const upsertRates = async (req, res) => {
  const per10 = req.body;

  // 1) Build normalized (÷10) & display (10/<value>)
  const normalized = buildNormalized(per10);
  const display = buildDisplayStrings(per10);

  // 2) Upsert numeric
  const numericDoc = await RateNumeric.findOne();
  const toSetNumeric = {};
  for (const k of Object.keys(normalized)) toSetNumeric[k] = normalized[k];

  if (!numericDoc) {
    await RateNumeric.create(toSetNumeric);
  } else {
    for (const k of Object.keys(toSetNumeric)) {
      numericDoc[k] = toSetNumeric[k];
    }
    await numericDoc.save();
  }

  // 3) Upsert display
  const displayDoc = await RateDisplay.findOne();
  const toSetDisplay = {};
  for (const k of Object.keys(display)) toSetDisplay[k] = display[k];

  if (!displayDoc) {
    await RateDisplay.create(toSetDisplay);
  } else {
    for (const k of Object.keys(toSetDisplay)) {
      displayDoc[k] = toSetDisplay[k];
    }
    await displayDoc.save();
  }

  // 4) Log action (like PHP log_action)
  const { ip, userAgent } = getClientInfo(req);
  await LoginLog.create({
    user_email: req.user?.email || "admin",
    ip_address: ip,
    login_timestamp: new Date(),
    user_agent: userAgent,
    remark: "Game rate updated."
  });

  return ok(res, { updated: true }, "Rates updated");
};
