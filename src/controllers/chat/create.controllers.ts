import { NextFunction, Request, Response } from "express";
import { createChat } from "../../services/chat/createChat";

export async function createChatController(req: Request, res: Response, next: NextFunction) {

	try {
		
		const { name } = req.body;

		if (!req.user) return res.status(401).json({ message: "Unauthorized" });

		const chat = await createChat(name, req.user.id);

		res.status(201).json(chat);

	} catch (err: any) {
		next(err);
	};

};