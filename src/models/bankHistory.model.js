import mongoose from "mongoose";

const BankHistorySchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    userMobile: { type: String, required: true, trim: true, maxlength: 255, alias: "user" },
    ac: { type: String, required: true, maxlength: 255 },
    holder: { type: String, required: true, maxlength: 255 },
    ifsc: { type: String, required: true, maxlength: 255 },
    mode: { type: String, required: true, maxlength: 255 },
    upi: { type: String, default: null, maxlength: 255 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null }
  },
  { timestamps: false, collection: "bank_history" }
);

BankHistorySchema.index({ userMobile: 1 });

export default mongoose.model("BankHistory", BankHistorySchema);
