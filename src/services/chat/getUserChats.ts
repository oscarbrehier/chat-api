import prisma from "../../prisma/client";
import { getSignedUrl } from "../../utils/supabase/getSignedUrl";
import { safeUser } from "../users";
import { getAvatarUrl } from "../../utils/supabase/getAvatarUrl";

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

	const processedChats = await Promise.all(
		chats.map(async ({ messages, ...chat }) => {

			const usersWithAvatar = await Promise.all(
				chat.users
					.map(async (user) => {

						if (user.id === userId || !user.avatarPath) return user;

						const avatarUrl = await getAvatarUrl(user.avatarPath);

						return {
							...user,
							avatarUrl
						};

					})
			);

			return {
				...chat,
				users: usersWithAvatar.filter(Boolean),
				latestMessage: messages[0]
			};

		})
	);

	return processedChats;

};