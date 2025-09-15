import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../../prisma/client";
import { BadRequestError, NotFoundError } from "../../utils/errors";

export async function deleteChat(chatId: string) {

	try {

		if (!chatId) throw new BadRequestError("Chat ID is required");

		await prisma.message.deleteMany({
			where: {
				chatId: chatId,
			},
		});

		const deletedChat = await prisma.chat.delete({
			where: {
				id: chatId
			}
		});

		return (deletedChat);

	} catch (error) {

		if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
			throw new NotFoundError("Chat not found");
		};

		throw (error);

	};

};