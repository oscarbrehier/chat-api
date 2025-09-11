import prisma from "../../prisma/client";
import { BadRequestError, NotFoundError } from "../../utils/errors";
import { getChat } from "../chat/getChat";

export async function sendMessage(chatId: string, senderId: string, content: string) {

	if (!chatId) throw new BadRequestError("Chat ID is required");
	if (!content || !content.trim()) throw new BadRequestError("Message content cannot be empty");

	const chat = await getChat(chatId);
	if (!chat) throw new NotFoundError("Chat not found");

	const message = await prisma.message.create({
		data: {
			chatId,
			senderId,
			content: content.trim()
		}
	});

	return (message);

};