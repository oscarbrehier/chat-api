import prisma from "../../prisma/client"
import { NotFoundError } from "../../utils/errors";

export async function getChat(chatId: string) {

	const chat = await prisma.chat.findUnique({
		where: {
			id: chatId
		},
		include: {
			users: true
		}
	});

	if (!chat) throw new NotFoundError("Chat not found");

	return (chat);

};