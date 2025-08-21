import mongoose from "mongoose";

const ImageSliderSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    image: { type: String, required: true, maxlength: 1255 },
    verify: { type: String, default: "0", enum: ["0", "1"] },
    refer: { type: String, default: "", maxlength: 125 },
    data: { type: String, default: "", maxlength: 1255 }
  },
  { timestamps: false, collection: "image_slider" }
);

export default mongoose.model("ImageSlider", ImageSliderSchema);
