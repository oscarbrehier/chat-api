import { Router } from "express";
import { getExistingDMController } from "../controllers/chat/getExistingDM.controllers";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = Router();

router.get("/existing", authenticateJWT, getExistingDMController);

export default router;