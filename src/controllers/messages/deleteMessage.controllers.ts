import { NextFunction, Request, Response } from "express";
import { deleteMessage } from "../../services/messages/deleteMessage";

export async function deleteMessageController(req: Request, res: Response, next: NextFunction) {

	try {

		if (!req.user) return res.status(401).json({ error: "Unauthorized" });
		if (!req.params.id) return res.status(400).json({ error: "Message ID is required" });

		const deletedMessage = await deleteMessage(req.params.id, req.user.id);

		res.status(200).json(deletedMessage);

	} catch (err) {
		next(err);
	};

};