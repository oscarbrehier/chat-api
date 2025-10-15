import prisma from "../../prisma/client";
import { BadRequestError, NotFoundError } from "../../utils/errors";
import { getChat } from "../chat/getChat";

export async function sendMessage(chatId: string, senderId: string, content: string | null, imageUrl: string | null) {

	if (!chatId) throw new BadRequestError("Chat ID is required");
	if (!content && !imageUrl) throw new BadRequestError("Message cannot be empty");

	const chat = await getChat(chatId);
	if (!chat) throw new NotFoundError("Chat not found");

	const message = await prisma.message.create({
		data: {
			chatId,
			senderId,
			...(content && { content: content.trim() }),
			...(imageUrl && { imageUrl })
		}
	});

	return (message);

};