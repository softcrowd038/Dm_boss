import mongoose from "mongoose";

const WithdrawOptionsSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    name: { type: String, required: true, maxlength: 255 },
    hint: { type: String, required: true, maxlength: 2555 },
    active: { type: String, default: "1", enum: ["0", "1"] }
  },
  { timestamps: false, collection: "withdraw_options" }
);

WithdrawOptionsSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("WithdrawOption", WithdrawOptionsSchema);
