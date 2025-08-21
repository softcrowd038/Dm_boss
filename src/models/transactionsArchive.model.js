import mongoose from "mongoose";

const TransactionsArchiveSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    userMobile: { type: String, required: true, trim: true, maxlength: 22, alias: "user" },
    amount: { type: String, required: true, maxlength: 22 },
    type: { type: String, enum: ["0", "1"], required: true },
    remark: { type: String, required: true, maxlength: 222 },
    owner: { type: String, default: "", maxlength: 255 },
    created_at: { type: String, required: true, maxlength: 22 },
    game_id: { type: String, default: "0", maxlength: 25 },
    batch_id: { type: String, default: "0", maxlength: 255 }
  },
  { timestamps: false, collection: "transactions_archive" }
);

TransactionsArchiveSchema.index({ userMobile: 1 });
TransactionsArchiveSchema.index({ game_id: 1 });

export default mongoose.model("TransactionArchive", TransactionsArchiveSchema);
