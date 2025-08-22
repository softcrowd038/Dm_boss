import mongoose from "mongoose";

const LoginLogsSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    user_email: { type: String, required: true, maxlength: 255 },
    ip_address: { type: String, required: true, maxlength: 255 },
    login_timestamp: { type: Date, default: Date.now },
    user_agent: { type: String, required: true },
    remark: { type: String, default: null }
  },
  { timestamps: false, collection: "login_logs" }
);

LoginLogsSchema.index({ user_email: 1, login_timestamp: -1 });

export default mongoose.model("LoginLog", LoginLogsSchema);
