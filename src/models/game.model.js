import mongoose from "mongoose";

const GamesSchema = new mongoose.Schema(
  {
    is_loss: { type: Number, default: 0, enum: [0, 1] },
    sn: { type: Number, index: true },
    userMobile: { type: String, required: true, trim: true, maxlength: 22, alias: "user" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    game: { type: String, required: true, maxlength: 22 },
    bazar: { type: String, required: true, maxlength: 55 },
    date: { type: String, required: true, maxlength: 22 },     // e.g. '08/07/2025'
    number: { type: String, required: true, maxlength: 255 },
    amount: { type: Number, required: true },
    status: { type: Number, default: 0, enum: [0, 1] },
    created_at: { type: String, required: true, maxlength: 22 }, // epoch string
    game_type: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false, collection: "games" }
);

GamesSchema.index({ userMobile: 1, timestamp: -1 });
GamesSchema.index({ bazar: 1, date: 1 });
GamesSchema.index({ game_type: 1 });

export default mongoose.model("Game", GamesSchema);
