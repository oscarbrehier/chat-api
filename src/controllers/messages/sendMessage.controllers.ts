import { NextFunction, Request, Response } from "express";
import { sendMessage } from "../../services/messages/sendMessage";

export async function sendMessageController(req: Request, res: Response, next: NextFunction) {

	try {

		const { chatId, ...body } = req.body;

		if (!req.user) return res.status(401).json({ message: "Unauthorized" });

		const message = await sendMessage(chatId, req.user?.id, body?.content ?? null, body?.imageUrl ?? null);

		res.status(200).json(message);

	} catch (err) {
		next(err);
	};

};