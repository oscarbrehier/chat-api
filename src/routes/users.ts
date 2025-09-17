import { Router } from "express";
import { authenticateAccessToken } from "../middleware/authenticateAccessToken";
import { getAllUsersController } from "../controllers/users/getUsers.controllers";

const router: Router = Router();

router.get("/", authenticateAccessToken, getAllUsersController);

export default router;