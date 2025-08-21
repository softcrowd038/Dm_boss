import mongoose from "mongoose";
import Game from "../models/game.model.js";
import User from "../models/users.model.js";
import Transaction from "../models/transactions.model.js";
import { created, ok } from "../utils/apiResponse.js";

export const placeBet = async (req, res) => {
  const { game, bazar, date, number, amount, game_type = "" } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(req.user.id).session(session);
    if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
    if (user.wallet < amount) throw Object.assign(new Error("Insufficient wallet"), { statusCode: 400 });

    const bet = await Game.create([{
      userId: user._id, userMobile: user.mobile, game, bazar, date, number, amount, game_type
    }], { session });

    user.wallet -= amount;
    await user.save({ session });

    await Transaction.create([{
      userId: user._id, userMobile: user.mobile, amount, type: "DEBIT", remark: `Bet placed ${game}/${bazar}/${date}`
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return created(res, { bet: bet[0] }, "Bet placed");
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

export const myBets = async (req, res) => {
  const list = await Game.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100).lean();
  return ok(res, { bets: list });
};
