import User from "../models/users.model.js";
import Transaction from "../models/transactions.model.js";
import { ok, created } from "../utils/apiResponse.js";

export const addFunds = async (req, res) => {
  const { amount, method } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  user.wallet += amount;
  await user.save();
  await Transaction.create({
    userId: user._id,
    userMobile: user.mobile,
    amount,
    type: "CREDIT",
    remark: `Add funds (${method})`
  });
  return created(res, { wallet: user.wallet }, "Wallet updated");
};

export const history = async (req, res) => {
  const list = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100).lean();
  return ok(res, { transactions: list });
};
