import { Router } from "express";
import multer from "multer";
import { uploadImageController } from "../controllers/images/upload.controllers";

const router = Router();
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 50 * 1024 * 1024
	}
});

router.post("/upload", upload.single("file"), uploadImageController);

export default router;