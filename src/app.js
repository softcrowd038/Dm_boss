import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import apiRouter from "./routes/index.js";
import { errorConverter, errorHandler, notFound } from "./middlewares/error.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// access logs in dev
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
});
app.use(limiter);

app.get("/", (req, res) => res.json({ ok: true, service: "matka-backend" }));

app.use("/api/v1", apiRouter);

// 404 + error middlewares
app.use(notFound);
app.use(errorConverter);
app.use(errorHandler);

export default app;
