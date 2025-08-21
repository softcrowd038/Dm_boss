import mongoose from "mongoose";

const TransactionsSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    userMobile: { type: String, required: true, trim: true, maxlength: 22, alias: "user" }, // SQL column `user`
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional modern ref
    amount: { type: String, required: true, maxlength: 22 },       // varchar in SQL
    type: { type: String, enum: ["0", "1"], required: true },      // 1=Receive, 0=Deduct
    remark: { type: String, required: true, maxlength: 222 },
    owner: { type: String, default: "", maxlength: 255 },
    created_at: { type: String, required: true, maxlength: 22 },   // epoch string
    game_id: { type: String, default: "0", maxlength: 25 },
    batch_id: { type: String, default: "0", maxlength: 255 },
    dated_on: { type: Date, default: Date.now },                   // SQL CURRENT_TIMESTAMP
    status: { type: Number, default: 1 }
  },
  { timestamps: false, collection: "transactions" }
);

TransactionsSchema.index({ userMobile: 1, dated_on: -1 });
TransactionsSchema.index({ batch_id: 1 });
TransactionsSchema.index({ game_id: 1 });

export default mongoose.model("Transaction", TransactionsSchema);
