import { Router } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: 'json' };

const router = Router();

router.use("/", swaggerUI.serve);
router.get("/", swaggerUI.setup(swaggerDocument));

export default router;
