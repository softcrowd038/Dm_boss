import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    notice: { type: String, required: true, maxlength: 2222 },
    howtoplay: { type: String, required: true, maxlength: 4444 },
    homeline: { type: String, required: true, maxlength: 555 }
  },
  { timestamps: false, collection: "content" }
);

export default mongoose.model("Content", ContentSchema);
