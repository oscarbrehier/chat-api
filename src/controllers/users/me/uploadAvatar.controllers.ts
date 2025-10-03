import { NextFunction, Request, Response } from "express";
import { uploadImage } from "../../../utils/supabase/uploadImage";
import { setUserAvatar } from "../../../services/users/me/setAvatar";

export async function uploadAvatarController(req: Request, res: Response, next: NextFunction) {

	try {

		const userId = req.user?.id;
		if (!userId) return res.status(404).json({ error: "User not found" });

		const file = (req as Request & { file?: Express.Multer.File }).file;

		if (!file) {
			return res.status(400).json({ error: "No avatar provided" });
		};

		const upload = await uploadImage(file, "avatar", userId, true);

		if (upload.error) {
			return res.status(500).json({ error: "Upload failed" });
		};

		const user = await setUserAvatar(userId, upload.path!);

		return res.status(200).json({ user: { ...user, avatarUrl: upload.url } });
		
	} catch (err) {
		next(err);
	};

};