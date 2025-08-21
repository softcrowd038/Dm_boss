import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import Admin from "../models/admin.model.js";
import { ok } from "../utils/apiResponse.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).lean(false);
  if (!admin || !admin.isActive) {
    const err = new Error("Invalid credentials");
    err.statusCode = httpStatus.UNAUTHORIZED;
    throw err;
  }

  const passOk = await bcrypt.compare(password, admin.password);
  if (!passOk) {
    const err = new Error("Invalid credentials");
    err.statusCode = httpStatus.UNAUTHORIZED;
    throw err;
  }

  // Only allow superadmins here (you can relax to ['superadmin','admin'] if needed)
  if (admin.role !== "superadmin") {
    const err = new Error("Forbidden: not a superadmin");
    err.statusCode = httpStatus.FORBIDDEN;
    throw err;
  }

  const token = jwt.sign(
    { id: admin._id, role: "superadmin", email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return ok(
    res,
    {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    },
    "Super admin logged in"
  );
};
