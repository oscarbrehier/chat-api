import prisma from "../../prisma/client";
import { NotFoundError } from "../../utils/errors";
import { Prisma } from "../../generated/prisma";
import { getAvatarUrl } from "../../utils/supabase/getAvatarUrl";

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
					readBy: true,
					emojiReactions: true,
					sender: true
				}
			}),
			prisma.message.count({
				where: { chatId }
			})
		]);

		if (!messages) throw new NotFoundError("Chat not found");

		const processedMessages = await Promise.all(
			messages.map(async (message) => {

				if (message.sender?.avatarPath) {
					
					const avatarUrl = await getAvatarUrl(message.sender.avatarPath);
					return {
						...message,
						sender: {
							...message.sender,
							avatarUrl: avatarUrl
						}
					};

				};

				return message;

			})
		);

		return ({
			totalCount,
			items: processedMessages.reverse(),
		});

	} catch (error) {
		throw (error);
	};

};