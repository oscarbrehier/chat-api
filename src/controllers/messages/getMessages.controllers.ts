import { deleteMessage } from "../../services/messages/deleteMessage";
import { NextFunction, Request, Response } from "express";
import { getMessages } from "../../services/messages/getMessages";

export async function getMessageController(req: Request, res: Response, next: NextFunction) {

	try {

		if (!req.params.chatId) return res.status(400).json({ error: "Chat ID is required"});

		const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
		const offset = req.query.limit ? parseInt(req.query.offset as string, 10) : 0;

		const result = await getMessages(req.params.chatId, limit, offset);

		res.status(200).json(result);

	} catch (err) {
		next(err);
	};

};