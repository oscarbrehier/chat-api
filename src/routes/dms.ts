import { Router } from "express";
import { getExistingDMController } from "../controllers/dm/getExistingDM.controllers";
import { authenticateUser } from "../middleware/authenticateUser";

const router = Router();

router.get("/existing", authenticateUser, getExistingDMController);

export default router;