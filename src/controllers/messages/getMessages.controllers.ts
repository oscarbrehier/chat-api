import { deleteMessage } from "../../services/messages/deleteMessage";
import { NextFunction, Request, Response } from "express";
import { getMessages } from "../../services/messages/getMessages";

export async function getMessageController(req: Request, res: Response, next: NextFunction) {

	try {

		if (!req.params.chatId) return res.status(400).json({ error: "Chat ID is required"});
		const messages = await getMessages(req.params.chatId);

		res.status(200).json(messages);

	} catch (err) {
		next(err);
	};

};