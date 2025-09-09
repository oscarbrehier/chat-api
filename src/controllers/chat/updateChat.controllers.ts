import { NextFunction, Request, Response } from "express";
import { updateChat } from "../../services/chat/updateChat";

export async function updateChatController(req: Request, res: Response, next: NextFunction) {

	try {

		const { name } = req.body;

		if (!req.params.id) return res.status(400).json({ error: "Chat ID is required" });
		const chat = await updateChat(req.params.id, name);

		res.status(200).json(chat);

	} catch (err) {
		next(err);
	};

};