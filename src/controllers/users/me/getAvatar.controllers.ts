import { NextFunction, Request, Response } from "express";
import { getAvatar } from "../../../services/users/me/getAvatar";
import { SIGNED_URL_TTL } from "../../../utils/supabase/getSignedUrl";

export async function getAvatarController(req: Request, res: Response, next: NextFunction) {

	try {

		const user = req.user;
		if (!user) return res.status(400).json({ error: "User not found" });

		const avatarUrl = await getAvatar(user?.id);
		
		res.set("Cache-Control", `private, max-age=${SIGNED_URL_TTL}`);
		return res.status(200).json({ avatarUrl });

	} catch (err) {
		next(err);
	};

};