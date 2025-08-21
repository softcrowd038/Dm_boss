import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import { created, ok } from "../utils/apiResponse.js";

export const register = async (req, res) => {
  const { mobile, name, email, password } = req.body;
  const existing = await User.findOne({ mobile });
  if (existing) throw Object.assign(new Error("Mobile already registered"), { statusCode: 409 });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ mobile, name, email, password: hash });
  return created(res, { user: { id: user._id, mobile: user.mobile, name: user.name } }, "Registered");
};

export const login = async (req, res) => {
  const { mobile, password } = req.body;
  const user = await User.findOne({ mobile });
  if (!user) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  const okPass = await bcrypt.compare(password, user.password);
  if (!okPass) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  const token = jwt.sign({ id: user._id, role: "user", mobile: user.mobile }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
  return ok(res, { token, user: { id: user._id, mobile: user.mobile, name: user.name, wallet: user.wallet } }, "Logged in");
};
