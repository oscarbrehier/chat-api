import { NextFunction, Request, Response } from "express";
import { sendMessage } from "../../services/messages/sendMessage";

export async function sendMessageController(req: Request, res: Response, next: NextFunction) {

	try {

		let imageUrl: string | null = null;
		const { chatId, content, ...restBody } = req.body;

		if (restBody?.imageUrl) {
			imageUrl = restBody.imageUrl;
		};

		if (!req.user) return res.status(401).json({ message: "Unauthorized" });

		const message = await sendMessage(chatId, req.user?.id, content, imageUrl);

		res.status(200).json(message);

	} catch (err) {
		next(err);
	};

};