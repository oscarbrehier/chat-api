import prisma from "../../prisma/client";

export async function markAsRead(
	chatId: string,
	messageId: string,
	userId: string
) {

	const message = await prisma.message.findUnique({
		where: {
			id: messageId
		}
	});

	if (!message) throw new Error("Message not found");

	const cutoff = message?.createdAt;

	const messagesToMark = await prisma.message.findMany({
		where: {
			chatId,
			createdAt: {
				lte: cutoff
			}
		},
		select: { id: true }
	});

	await prisma.messageRead.createMany({
		data: messagesToMark.map(m => ({ messageId: m.id, userId })),
		skipDuplicates: true
	});

};