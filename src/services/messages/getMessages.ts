import prisma from "../../prisma/client";
import { NotFoundError } from "../../utils/errors";

export async function getMessages(chatId: string) {

	try {
	
		const chat = await prisma.chat.findUnique({
			where: { id: chatId },
			include: {
				messages: true
			}
		});

		if (!chat) throw new NotFoundError("Chat not found");

		return (chat.messages);

	} catch (error) {
		throw (error);
	};

};