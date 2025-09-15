import prisma from "../../prisma/client";
import { BadRequestError } from "../../utils/errors";

export async function addUser(chatId: string, userId: string) {

	if (!chatId) throw new BadRequestError("Chat ID is required");
	if (!userId) throw new BadRequestError("User ID is required");

	try {

		const chat = await prisma.chat.update({
			where: {
				id: chatId
			},
			data: {
				users: {
					connect: { id: userId }
				}
			},
			include: {
				users: {
					select: {
						id: true,
						name: true,
						email: true,
						createdAt: true
					}
				}
			}
		});

		return (chat);

	} catch (err) {
		throw err;
	};

};