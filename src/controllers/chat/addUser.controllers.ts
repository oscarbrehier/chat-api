import { NextFunction, Request, Response } from "express";
import { addUser } from "../../services/chat/addUser";

export async function addUserController(req: Request, res: Response, next: NextFunction) {

	try {

		const { id: chatId } = req.params;
		const { userId } = req.body;

		if (!chatId) return res.status(400).json({ error: "Chat ID is required" });
		const chat = await addUser(chatId, userId);
		
		res.status(200).json(chat);

	} catch (err) {
		next(err);
	};

};