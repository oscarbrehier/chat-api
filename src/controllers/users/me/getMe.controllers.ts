import { NextFunction, Request, Response } from "express";
import { getMe } from "../../../services/users/me/getMe";

export async function getMeController(req: Request, res: Response, next: NextFunction) {

	try {

		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ error: "User not found" });

		const user = await getMe(userId);
		return res.status(200).json({ user });

	} catch (err) {
		next(err);
	};

};