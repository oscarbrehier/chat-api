import prisma from "../../prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../utils/errors";

export async function updateMessage(messageId: string, userId: string, content: string) {

	try {
	
		if (!messageId) throw new BadRequestError("Message ID is required");
		if (!content || !content.trim()) throw new BadRequestError("Message content cannot be empty");

		const message = await prisma.message.findUnique({ where: { id: messageId }});
		if (message?.senderId !== userId) throw new UnauthorizedError("Not authorized");

		const updatedMessage = await prisma.message.update({
			where: { id: messageId },
			data: { content },
			include: {
				sender: true
			}
		});

		return (updatedMessage);

	} catch (error) {

		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === "P2025") {
				throw new NotFoundError("Message not found");
			};
		};

		throw (error);
	};

};