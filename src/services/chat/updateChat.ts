import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../../prisma/client";
import { BadRequestError, NotFoundError } from "../../utils/errors";

export async function updateChat(chatId: string, name: string) {

	try {
	
		if (!chatId) throw new BadRequestError("Chat ID is required");
		if (!name || !name.trim()) throw new BadRequestError("Chat name cannot be empty");


		const updatedChat = await prisma.chat.update({
			where: {
				id: chatId
			},
			data: {
				name: name.trim()
			}
		});

		return (updatedChat);

	} catch (error) {
		
		if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
			throw new NotFoundError("Chat not found");
		};

		throw (error);

	};

};