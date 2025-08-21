import pino from "pino";

const logger = pino({
  transport: process.env.NODE_ENV !== "production" ? { target: "pino-pretty" } : undefined,
  level: process.env.NODE_ENV === "test" ? "warn" : "info"
});

export default logger;
