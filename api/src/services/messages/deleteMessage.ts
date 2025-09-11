import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../../prisma/client";
import { NotFoundError } from "../../utils/errors";

export async function deleteMessage(messageId: string, userId: string) {

	try {

		const deletedMessage = await prisma.message.delete({ where: { id: messageId } });
		return deletedMessage;

	} catch (error) {

		if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {

			throw new NotFoundError("Message not found");

		};

		throw error;
	}

};