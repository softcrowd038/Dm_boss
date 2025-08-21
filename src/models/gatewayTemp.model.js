import mongoose from "mongoose";

const GatewayTempSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    userMobile: { type: String, required: true, maxlength: 255, alias: "user" },
    amount: { type: String, default: "", maxlength: 255 },
    hash: { type: String, required: true, maxlength: 255 },
    type: { type: String, default: "", maxlength: 25 }
  },
  { timestamps: false, collection: "gateway_temp" }
);

GatewayTempSchema.index({ userMobile: 1, hash: 1 });

export default mongoose.model("GatewayTemp", GatewayTempSchema);
