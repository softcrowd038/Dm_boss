import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Admin from "../models/admin.model.js";

(async () => {
  try {
    await connectDB();
    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;
    if (!email || !password) throw new Error("Set SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD in .env");

    let admin = await Admin.findOne({ email });
    if (admin) {
      console.log("Superadmin already exists:", email);
    } else {
      const hash = await bcrypt.hash(password, 10);
      admin = await Admin.create({
        email,
        password: hash,
        role: "superadmin",
        isActive: true
      });
      console.log("✅ Superadmin created:", admin.email);
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
