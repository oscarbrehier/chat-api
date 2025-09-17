import prisma from "../../prisma/client";

export async function getLatestMessage(chatId: string) {

	const latestMessage = await prisma.message.findFirst({
		where: {
			chatId
		},
		orderBy: [
			{
				createdAt: "desc"
			}
		]
	});

	return (latestMessage);

};