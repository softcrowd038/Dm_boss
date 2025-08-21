import mongoose from "mongoose";

const GatewayConfigSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    name: { type: String, required: true, maxlength: 255 },
    active: { type: String, required: true, enum: ["0", "1"] }
  },
  { timestamps: false, collection: "gateway_config" }
);

GatewayConfigSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("GatewayConfig", GatewayConfigSchema);
