import prisma from "../../prisma/client";
import { safeUser } from "../users";

export async function getUserChats(userId: string) {

	const chats = await prisma.chat.findMany({
		where: {
			users: {
				some: {
					id: userId
				}
			}
		},
		include: {
			users: {
				select: safeUser
			},
			messages: {
				take: 1,
				orderBy: [{ createdAt: "desc" }],
				include: {
					sender: {
						select: safeUser
					}
				}
			}
		}
	});

	return chats.map(({ messages, ...chat}) => ({
		...chat,
		latestMessage: messages[0]
	}));

};