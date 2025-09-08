import { Router } from "express";
import { signUpController } from "../controllers/auth/signUp.controllers";
import { loginController } from "../controllers/auth/login.controllers";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router: Router = Router();

router.post("/signup", signUpController);
router.post("/login", loginController);
router.get("/test", authenticateJWT, (req, res) => {
	console.log(req.user);
	res.send(200);
});

export default router;