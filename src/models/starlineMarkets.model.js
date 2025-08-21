import mongoose from "mongoose";

const StarlineMarketsSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    image: { type: String, default: "" },
    name: { type: String, required: true, maxlength: 255 },
    days: { type: String, required: true, maxlength: 2555 },
    active: { type: Number, default: 1, enum: [0, 1] }
  },
  { timestamps: false, collection: "starline_markets" }
);

StarlineMarketsSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("StarlineMarket", StarlineMarketsSchema);
