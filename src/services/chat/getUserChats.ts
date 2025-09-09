import prisma from "../../prisma/client";

export async function getUserChats(userId: string) {

	const chats = await prisma.chat.findMany({
		where: {
			users: {
				some: {
					id: userId
				}
			}
		}
	});

	return (chats);

};