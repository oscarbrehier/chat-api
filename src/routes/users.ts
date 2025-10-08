import { Router } from "express";
import { authenticateUser } from "../middleware/authenticateUser";
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

router.get("/", authenticateUser, getAllUsersController);
router.get("/me", authenticateUser, getMeController);
router.post("/me/avatar", authenticateUser, upload.single("file"), uploadAvatarController);
router.get("/me/avatar", authenticateUser, getAvatarController);

export default router;