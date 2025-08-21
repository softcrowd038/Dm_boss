import { createServer } from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";

const port = process.env.PORT || 5002;

(async () => {
  await connectDB();
  const server = createServer(app);
  server.listen(port, () => logger.info(`🚀 Server listening on :${port}`));
})();
