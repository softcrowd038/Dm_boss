import httpStatus from "http-status";
import logger from "../utils/logger.js";

export const notFound = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Route not found" });
};

export const errorConverter = (err, req, res, next) => {
  // normalize error
  err.statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || "Internal Server Error"
  };
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }
  logger.error({ err }, payload.message);
  res.status(status).json(payload);
};
