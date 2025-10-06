import prisma from "../../prisma/client"
import { NotFoundError } from "../../utils/errors";
import { safeUser } from "../users";

export async function getChat(chatId: string) {

	const chat = await prisma.chat.findUnique({
		where: {
			id: chatId
		},
		select: {
			id: true,
			name: true,
			type: true,
			createdAt: true,
			users: {
				select: safeUser
			}
		}
	});

	if (!chat) throw new NotFoundError("Chat not found");

	return (chat);

};