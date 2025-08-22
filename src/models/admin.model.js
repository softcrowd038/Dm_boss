import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    email: { type: String, trim: true, maxlength: 200, required: true, unique: true },
    password: { type: String, maxlength: 1000, required: true }, // bcrypt hash
    wallet: { type: String, default: "0", maxlength: 255 },
    ref_id: { type: String, default: null, maxlength: 5000 },
    tasks: { type: String, default: null, maxlength: 300 },
    commision: { type: Number, default: null },
    app_download: { type: String, default: null, maxlength: 200 },
    session_token: { type: String, default: null, maxlength: 255 },
    role: { type: String, enum: ["superadmin", "admin"], default: "admin", index: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "admin" }
);

AdminSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("Admin", AdminSchema);
