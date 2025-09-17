import { Router } from "express";
import { getExistingDMController } from "../controllers/dm/getExistingDM.controllers";
import { authenticateAccessToken } from "../middleware/authenticateAccessToken";

const router = Router();

router.get("/existing", authenticateAccessToken, getExistingDMController);

export default router;