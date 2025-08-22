import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../src/models/admin.model.js";

await mongoose.connect(process.env.MONGO_URI);

const email = "superadmin@example.com";
const passHash = await bcrypt.hash("superadminsecret123", 10);

await Admin.updateOne(
  { email },
  { $set: { email, password: passHash, role: "superadmin", isActive: true } },
  { upsert: true }
);
console.log("✅ Seeded/updated admin:", email);

await mongoose.disconnect();
