import prisma from "../../prisma/client";

export async function addMessageReaction(
	messageId: string,
	userId: string,
	emoji: string
) {

	const existing = await prisma.emojiReaction.findUnique({
		where: {
			messageId_userId_emoji: {
				messageId,
				userId,
				emoji
			}
		}
	});

	if (existing) {

		await prisma.emojiReaction.delete({
			where: {
				id: existing.id
			}
		});

		return { removed: true };

	} else {

		const reaction = await prisma.emojiReaction.create({
			data: {
				messageId,
				userId,
				emoji
			}
		});
	
		return {
			added: true,
			reaction
		};

	};

};