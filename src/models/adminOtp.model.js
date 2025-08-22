import mongoose from "mongoose";

const AdminOtpSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    email: { type: String, required: true, index: true },
    sessionToken: { type: String, required: true, index: true },
    purpose: { type: String, enum: ["login"], default: "login", index: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: parseInt(process.env.OTP_MAX_ATTEMPTS || "5", 10) },
    usedAt: { type: Date, default: null }
  },
  { timestamps: true, collection: "admin_otps" }
);


AdminOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("AdminOtp", AdminOtpSchema);
