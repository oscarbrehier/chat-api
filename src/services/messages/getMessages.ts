import prisma from "../../prisma/client";
import { NotFoundError } from "../../utils/errors";
import { Prisma } from "../../generated/prisma";

export async function getMessages(
	chatId: string,
	limit: number = 10,
	offset: number = 0
): Promise<{
	items: (Prisma.MessageGetPayload<{
		include: { readBy: true }
	}>)[], totalCount: number
}> {

	try {

		if (limit > 100) limit = 100;

		const [messages, totalCount] = await prisma.$transaction([
			prisma.message.findMany({
				where: {
					chatId
				},
				take: limit,
				...(offset && { skip: offset }),
				orderBy: {
					createdAt: "desc"
				},
				include: {
					readBy: true
				}
			}),
			prisma.message.count({
				where: { chatId }
			})
		]);

		if (!messages) throw new NotFoundError("Chat not found");

		return ({
			totalCount,
			items: messages.reverse(),
		});

	} catch (error) {
		throw (error);
	};

};