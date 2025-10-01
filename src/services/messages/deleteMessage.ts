import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../../prisma/client";
import { NotFoundError } from "../../utils/errors";

export async function deleteMessage(messageId: string, userId: string) {

	try {

		// const deletedMessage = await prisma.message.delete({ where: { id: messageId, senderId: userId } });
		// return deletedMessage;

		const message = await prisma.message.findUnique({
			where: {
				id: messageId
			},
			select: { senderId: true, chatId: true }
		});

		if (!message) throw new NotFoundError("Message not found");
		if (message.senderId !== userId) throw new NotFoundError("Message not found");

		await prisma.$transaction([
			prisma.messageRead.deleteMany({
				where: { messageId }
			}),
			prisma.emojiReaction.deleteMany({
				where: { messageId }
			}),
			prisma.message.delete({
				where: { id: messageId }
			}),
		]);

		return { chatId: message.chatId };

	} catch (error) {

		if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {

			throw new NotFoundError("Message not found");

		};

		throw error;
	}

};