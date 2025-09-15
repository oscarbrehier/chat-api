import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { getAllUsersController } from "../controllers/users/getUsers.controllers";

const router: Router = Router();

router.get("/", authenticateJWT, getAllUsersController);

export default router;