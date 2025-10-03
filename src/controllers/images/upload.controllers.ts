import { NextFunction, Request, Response } from "express";
import { uploadImage } from "../../utils/supabase/uploadImage";
import { randomUUID } from "crypto";

export async function uploadImageController(req: Request, res: Response, next: NextFunction) {

	try {

		const file = (req as Request & { file?: Express.Multer.File }).file;

		if (!file) {
			return res.status(400).json({ error: "No file provided" });
		};

		const { bucket, chatId } = req.body;
		const upload = await uploadImage(file, bucket, chatId);

		if (upload.error) {
			return res.status(500).json({ error: "Upload failed" });
		};

		return res.status(200).json({ url: upload.url });

	} catch (err) {
		next(err);
	};

};