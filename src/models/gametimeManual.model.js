import mongoose from "mongoose";

const GametimeManualSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    market: { type: String, required: true, maxlength: 255 },
    open: { type: String, required: true, maxlength: 255 },   // "HH:mm"
    close: { type: String, required: true, maxlength: 255 },
    days: { type: String, required: true, maxlength: 255 },
    sort_no: { type: Number, required: true },
    active: { type: String, default: "1", enum: ["0", "1"] },
    type: { type: Number, default: 1 },
    open_status: { type: Number, default: 0, enum: [0, 1] },
    close_status: { type: Number, default: 0, enum: [0, 1] }
  },
  { timestamps: false, collection: "gametime_manual" }
);

GametimeManualSchema.index({ market: 1 });

export default mongoose.model("GametimeManual", GametimeManualSchema);
