import User from "../models/users.model.js";
import { ok } from "../utils/apiResponse.js";

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  delete user.password;
  return ok(res, { user });
};
