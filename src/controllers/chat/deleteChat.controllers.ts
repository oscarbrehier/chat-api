import { NextFunction, Request, Response } from "express";
import { deleteChat } from "../../services/chat/deleteChat";

export async function deleteChatController(req: Request, res: Response, next: NextFunction) {

	try {

		if (!req.params.id) return res.status(400).json({ error: "Chat ID is required" });
		const deletedChat = await deleteChat(req.params.id);

		res.status(200).json(deletedChat);

	} catch (err) {
		next(err);
	};

};