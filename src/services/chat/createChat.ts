import prisma from "../../prisma/client";
import { BadRequestError } from "../../utils/errors";

export async function createChat(name: string, userId: string) {

	if (!name || !name.trim()) throw new BadRequestError("Chat name cannot be empty");

	const chat = await prisma.chat.create({
		data: {
			name,
			users: {
				connect: [{ id: userId }]
			}
		}
	});

	return (chat);

};