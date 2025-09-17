import { Request, Response, Router } from "express";
import { signUpController } from "../controllers/auth/signUp.controllers";
import { loginController } from "../controllers/auth/login.controllers";
import { authenticateAccessToken } from "../middleware/authenticateAccessToken";
import { refreshTokenController } from "../controllers/auth/refreshToken.controllers";

const router: Router = Router();

router.post("/signup", signUpController);
router.post("/login", loginController);
router.get("/refresh-token", refreshTokenController);

router.get("/me", authenticateAccessToken, (req: Request, res: Response) => {
	res.sendStatus(200);
});

export default router;