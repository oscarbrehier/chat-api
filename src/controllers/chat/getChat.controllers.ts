import { NextFunction, Request, Response } from "express";
import { getChat } from "../../services/chat/getChat";

export async function getChatController(req: Request, res: Response, next: NextFunction) {

	try {

		if (!req.params.id) return res.status(400).json({ error: "Chat ID is required" });
		const chat = await getChat(req.params.id);

		res.status(200).json(chat);

	} catch (err) {
		next(err);
	};

};