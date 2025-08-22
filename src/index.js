import "dotenv/config";               // <= REQUIRED so process.env.* works
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import routes from "./routes/index.js";

const app = express();

// security & parsing
app.use(helmet());
app.use(cors({ origin: "http://localhost:5002", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// mongo
await mongoose.connect(process.env.MONGO_URI);
console.info("✅ MongoDB connected");

// routes
app.use("/api/v1", routes);

// error handler (basic)
app.use((err, req, res, next) => {
  const code = err.statusCode || 500;
  res.status(code).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {})
  });
});

const port = process.env.PORT || 5002;
app.listen(port, () => console.info(`🚀 Server listening on :${port}`));
