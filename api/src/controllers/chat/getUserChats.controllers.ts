import { NextFunction, Request, Response } from "express";
import { getUserChats } from "../../services/chat/getUserChats";

export async function getUserChatsController(req: Request, res: Response, next: NextFunction) {

	try {

		if (!req.user) return res.status(401).json({ message: "Unauthorized" });
		const chats = await getUserChats(req.user.id);

		res.status(200).json(chats);

	} catch (err) {
		next(err);
	};

};