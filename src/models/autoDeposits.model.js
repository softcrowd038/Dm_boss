import mongoose from "mongoose";

const AutoDepositsSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    mobile: { type: String, required: true, trim: true, maxlength: 20 },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["MANUAL", "Razorpay", "Added By Admin"], default: null },
    pay_id: { type: String, default: null, maxlength: 555 },
    created_at: { type: Date, default: Date.now },
    status: { type: Number, default: null, enum: [0, 1, 2] }, // 0=PENDING,1=APPROVED,2=REJECT
    updated_at: { type: Date, default: null },
    date: { type: String, default: null },
    ip_address: { type: String, default: null, maxlength: 255 },
    razorpay_response: { type: String, default: null } // JSON as text
  },
  { timestamps: false, collection: "auto_deposits" }
);

AutoDepositsSchema.index({ mobile: 1, created_at: -1 });

export default mongoose.model("AutoDeposit", AutoDepositsSchema);
