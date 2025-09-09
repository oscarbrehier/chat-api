import { NextFunction, Request, Response } from "express";
import { updateMessage } from "../../services/messages/updateMessage";

export async function updateMessageController(req: Request, res: Response, next: NextFunction) {

	try {

		if (!req.user) return res.status(401).json({ error: "Unauthorized" });
		if (!req.params.id) return res.status(400).json({ error: "Message ID is required" }); 
		
		const { content } = req.body;
		const message = await updateMessage(req.params.id, req.user?.id, content);

		res.status(200).json(message);

	} catch (err) {
		next(err);
	};

};