import httpStatus from "http-status";
import GametimeManual from "../models/gametimeManual.model.js";
import { getNextSeq } from "../utils/sequence.js";
import { buildDaysString } from "../utils/markets.js";
import { ok, created } from "../utils/apiResponse.js";

// optional action log
import LoginLog from "../models/loginLogs.model.js";

function clientInfo(req) {
  return {
    ip: (req.headers["x-forwarded-for"] || "").split(",")[0] || req.socket?.remoteAddress || req.ip || "",
    ua: req.headers["user-agent"] || ""
  };
}

async function logAction(req, remark) {
  const { ip, ua } = clientInfo(req);
  try {
    await LoginLog.create({
      user_email: req.user?.email || "admin",
      ip_address: ip,
      login_timestamp: new Date(),
      user_agent: ua,
      remark
    });
  } catch { /* ignore */ }
}

// GET /admin/markets
export const listMarkets = async (req, res) => {
  const items = await GametimeManual.find().sort({ sort_no: 1, market: 1 });
  return ok(res, { items }, "OK");
};

// POST /admin/markets
export const createMarket = async (req, res) => {
  const { market, open, close, sort_no, perDay } = req.body;

  // build days string like PHP page
  const days = buildDaysString(open, close, perDay);

  // auto-increment legacy sn
  const sn = await getNextSeq("gametime_manual");

  const doc = await GametimeManual.create({
    sn, market: market.toUpperCase().trim(), open, close,
    days, sort_no: sort_no ?? 0, active: "1"
  });

  await logAction(req, `Market created: ${doc.market}`);
  return created(res, { market: doc }, "Market created");
};

// PUT /admin/markets/:id
export const updateMarket = async (req, res) => {
  const id = req.params.id;
  const payload = {};
  if (req.body.open) payload.open = req.body.open;
  if (req.body.close) payload.close = req.body.close;
  if (typeof req.body.sort_no === "number") payload.sort_no = req.body.sort_no;

  // If perDay provided, (re)build days string using (new or existing) open/close
  if (req.body.perDay) {
    const current = await GametimeManual.findById(id);
    if (!current) {
      return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Market not found" });
    }
    const baseOpen = payload.open ?? current.open;
    const baseClose = payload.close ?? current.close;
    payload.days = buildDaysString(baseOpen, baseClose, req.body.perDay);
  }

  const doc = await GametimeManual.findByIdAndUpdate(id, payload, { new: true });
  if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Market not found" });

  await logAction(req, `Market updated: ${doc.market}`);
  return ok(res, { market: doc }, "Market updated");
};

// PATCH /admin/markets/:id/active
export const patchActive = async (req, res) => {
  const id = req.params.id;
  const { active } = req.body; // "0" or "1"
  const doc = await GametimeManual.findByIdAndUpdate(id, { active }, { new: true });
  if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Market not found" });

  await logAction(req, `Market ${active === "1" ? "activated" : "deactivated"}: ${doc.market}`);
  return ok(res, { market: doc }, "Status changed");
};

// DELETE /admin/markets/:id
export const deleteMarket = async (req, res) => {
  const id = req.params.id;
  const doc = await GametimeManual.findByIdAndDelete(id);
  if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Market not found" });

  await logAction(req, `Market deleted: ${doc.market}`);
  return ok(res, {}, "Market deleted");
};
