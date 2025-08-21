import mongoose from "mongoose";

const StarlineGamesSchema = new mongoose.Schema(
  {
    sn: { type: Number, index: true },
    userMobile: { type: String, required: true, maxlength: 22, alias: "user" },
    game: { type: String, required: true, maxlength: 22 },
    bazar: { type: String, required: true, maxlength: 55 },
    timing_sn: { type: String, required: true, maxlength: 255, default: "0" },
    date: { type: String, required: true, maxlength: 22 },
    number: { type: String, required: true, maxlength: 22 },
    amount: { type: String, required: true, maxlength: 22 },
    status: { type: Number, default: 0, enum: [0, 1] },
    created_at: { type: String, required: true, maxlength: 22 },
    win_amount: { type: String, default: "0", maxlength: 255 },
    is_loss: { type: Number, default: 0, enum: [0, 1] }
  },
  { timestamps: false, collection: "starline_games" }
);

StarlineGamesSchema.index({ userMobile: 1, created_at: -1 });

export default mongoose.model("StarlineGame", StarlineGamesSchema);
