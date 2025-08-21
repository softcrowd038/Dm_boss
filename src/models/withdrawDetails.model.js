import mongoose from "mongoose";

const WithdrawDetailsSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    userMobile: { type: String, required: true, maxlength: 255, alias: "user" },
    prefered: { type: String, required: true, maxlength: 255 },
    upi: { type: String, required: true, maxlength: 255 },
    acno: { type: String, required: true, maxlength: 255 },
    name: { type: String, required: true, maxlength: 255 },
    ifsc: { type: String, required: true, maxlength: 255 },
    bank: { type: String, required: true, maxlength: 255 },
    phonepe: { type: String, required: true, maxlength: 255 },
    paytm: { type: String, required: true, maxlength: 255 },
    gpay: { type: String, required: true, maxlength: 255 }
  },
  { timestamps: false, collection: "withdraw_details" }
);

WithdrawDetailsSchema.index({ userMobile: 1 });

export default mongoose.model("WithdrawDetail", WithdrawDetailsSchema);
