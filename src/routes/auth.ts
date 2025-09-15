import { Request, Response, Router } from "express";
import { signUpController } from "../controllers/auth/signUp.controllers";
import { loginController } from "../controllers/auth/login.controllers";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router: Router = Router();

router.post("/signup", signUpController);
router.post("/login", loginController);
router.get("/me", authenticateJWT, (req: Request, res: Response) => {
	res.sendStatus(200);
});

export default router;