import jwt from "jsonwebtoken";
import httpStatus from "http-status";

export const auth = (roles = []) => {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Missing token" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(httpStatus.FORBIDDEN).json({ success: false, message: "Forbidden" });
      }
      next();
    } catch (e) {
      return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid token" });
    }
  };
};
