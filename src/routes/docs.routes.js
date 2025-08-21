import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load openapi.yaml located at src/docs/openapi.yaml
const docPath = path.join(__dirname, "..", "docs", "openapi.yaml");
const swaggerDocument = YAML.load(docPath);

const router = Router();
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
