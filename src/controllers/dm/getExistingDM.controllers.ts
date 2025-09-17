import { NextFunction, Request, Response } from "express";
import { getExistingDM } from "../../services/chat/getExistingDM";

export async function getExistingDMController(req: Request, res: Response, next: NextFunction) {

	try {

		const otherUserId = req.query.userId;
		if (!otherUserId) res.status(400).json({ error: "Missing required query parameter: `userId`" });

		const chat = await getExistingDM(req.user?.id!, otherUserId as string);
		res.status(200).json(chat);

	} catch (err) {
		next(err);
	};

};