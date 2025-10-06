import { Router } from "express";
import { authenticateAccessToken } from "../middleware/authenticateAccessToken";
import { getAllUsersController } from "../controllers/users/getUsers.controllers";
import multer from "multer";
import { uploadAvatarController } from "../controllers/users/me/uploadAvatar.controllers";
import { getMeController } from "../controllers/users/me/getMe.controllers";
import { getAvatarController } from "../controllers/users/me/getAvatar.controllers";

const router: Router = Router();

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 50 * 1024 * 1024
	}
});

router.get("/", authenticateAccessToken, getAllUsersController);
router.get("/me", authenticateAccessToken, getMeController);
router.post("/me/avatar", authenticateAccessToken, upload.single("file"), uploadAvatarController);
router.get("/me/avatar", authenticateAccessToken, getAvatarController);

export default router;