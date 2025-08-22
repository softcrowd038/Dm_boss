import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";

import Admin from "../models/admin.model.js";
import AdminOtp from "../models/adminOtp.model.js";
import LoginLog from "../models/loginLogs.model.js";

import { sendOtpWhatsapp } from "../services/whatsapp.service.js";
import { generateOtp, hashOtp, verifyOtp } from "../utils/otp.js";
import { ok, created } from "../utils/apiResponse.js";

const otpDigits = parseInt(process.env.OTP_DIGITS || "4", 10);
const otpExpMin = parseInt(process.env.OTP_EXP_MINUTES || "5", 10);

function getClientInfo(req) {
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0] || req.socket?.remoteAddress || req.ip || "";
  const userAgent = req.headers["user-agent"] || "";
  return { ip, userAgent };
}
function computeRole(email) {
  const list = (process.env.ADMIN_SUPER_EMAILS || "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(String(email).toLowerCase()) ? "superadmin" : "admin";
}


// Step 1: email+password -> OTP
export const adminLoginStart = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });

  const passOK = await bcrypt.compare(password, admin.password || "");
  if (!passOK) return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });

  const sessionToken = uuidv4();
  admin.session_token = sessionToken;
  await admin.save();

  const otp = generateOtp(otpDigits);
  const otpHashed = await hashOtp(otp);
  const expiresAt = new Date(Date.now() + otpExpMin * 60 * 1000);

  await AdminOtp.create({
    adminId: admin._id,
    email: admin.email,
    sessionToken,
    otpHash: otpHashed,
    expiresAt
  });

  try {
    await sendOtpWhatsapp(otp);
  } catch (err) {
    await AdminOtp.deleteMany({ adminId: admin._id, sessionToken });
    const isDev = process.env.NODE_ENV !== "production";
    return res.status(httpStatus.BAD_GATEWAY).json({
      success: false,
      message: "OTP send failed. Try again.",
      ...(isDev && err?.details ? { details: err.details } : {})
    });
  }

  return created(res,
    { sessionToken, otpExpiresInSec: otpExpMin * 60 },
    "OTP sent to configured WhatsApp number"
  );
};

// Step 2: verify OTP -> JWT
export const adminVerifyOtp = async (req, res) => {
  const { email, sessionToken, otp } = req.body;

  const admin = await Admin.findOne({ email, session_token: sessionToken });
  if (!admin) return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid session" });

  const otpDoc = await AdminOtp.findOne({
    adminId: admin._id,
    email: admin.email,
    sessionToken,
    purpose: "login",
    usedAt: null,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });

  if (!otpDoc) return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "OTP expired or invalid" });
  if (otpDoc.attempts >= otpDoc.maxAttempts) {
    return res.status(httpStatus.TOO_MANY_REQUESTS).json({ success: false, message: "Too many OTP attempts" });
  }

  const match = await verifyOtp(otp, otpDoc.otpHash);
  if (!match) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid OTP" });
  }

  otpDoc.usedAt = new Date();
  await otpDoc.save();

  // in adminVerifyOtp
// in adminVerifyOtp
const computed = computeRole(admin.email);
const role = admin.role || computed; // prefer DB role if set
const token = jwt.sign(
  { id: admin._id, role, email: admin.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
);


  const { ip, userAgent } = getClientInfo(req);
  await LoginLog.create({
    user_email: admin.email,
    ip_address: ip,
    login_timestamp: new Date(),
    user_agent: userAgent,
    remark: "Admin successfully logged in with OTP verification"
  });

  return ok(res, { token, admin: { id: admin._id, email: admin.email, role } }, "Super admin logged in");
};

// Optional: resend OTP
export const adminResendOtp = async (req, res) => {
  const { email, sessionToken } = req.body;

  const admin = await Admin.findOne({ email, session_token: sessionToken });
  if (!admin) return res.status(401).json({ success: false, message: "Invalid session" });

  await AdminOtp.updateMany(
    { adminId: admin._id, sessionToken, usedAt: null },
    { $set: { usedAt: new Date() } }
  );

  const otp = generateOtp(otpDigits);
  const otpHashed = await hashOtp(otp);
  const expiresAt = new Date(Date.now() + otpExpMin * 60 * 1000);

  await AdminOtp.create({
    adminId: admin._id,
    email: admin.email,
    sessionToken,
    otpHash: otpHashed,
    expiresAt
  });

  try {
    await sendOtpWhatsapp(otp);
  } catch (err) {
    await AdminOtp.deleteMany({ adminId: admin._id, sessionToken, usedAt: null });
    const isDev = process.env.NODE_ENV !== "production";
    return res.status(502).json({
      success: false,
      message: "OTP send failed. Try again.",
      ...(isDev && err?.details ? { details: err.details } : {})
    });
  }

  return res.status(201).json({
    success: true,
    message: "OTP resent",
    data: { otpExpiresInSec: otpExpMin * 60 }
  });
};

// Optional: logout
export const adminLogout = async (req, res) => {
  const { email } = req.body;
  await Admin.updateOne({ email }, { $set: { session_token: null } });
  return ok(res, {}, "Logged out");
};
