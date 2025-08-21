import mongoose from "mongoose";

const RazorpayReqSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    mobile: { type: String, default: null, maxlength: 200 },
    amount: { type: String, default: null, maxlength: 200 },
    method: { type: String, default: null, maxlength: 200 },
    pay_id: { type: String, default: null, maxlength: 200 },
    created_at: { type: Date, default: Date.now },
    status: { type: Number, default: null },
    updated_at: { type: Date, default: null },
    date: { type: String, default: null }
  },
  { timestamps: false, collection: "razorpay_req" }
);

RazorpayReqSchema.index({ mobile: 1, created_at: -1 });

export default mongoose.model("RazorpayReq", RazorpayReqSchema);
