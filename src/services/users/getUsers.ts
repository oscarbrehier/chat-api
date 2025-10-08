import { safeUser } from ".";
import { Prisma } from "@prisma/client";
import prisma from "../../prisma/client";

type Options = {
	searchQuery?: string;
	maxEntries?: number;
	excludeUsers?: string[];
	excludeUserSelf?: boolean;
};

export async function getUsers(
	userId: string,
	options: Options = {
		excludeUserSelf: true
	}
) {

	const { searchQuery, maxEntries, excludeUsers = [], excludeUserSelf } = options;

	const where: Prisma.UserWhereInput = {
		id: {
			notIn: [
				...(excludeUserSelf ? [userId] : []),
				...excludeUsers
			]
		},
		...(searchQuery && {
			name: {
				contains: searchQuery,
				mode: "insensitive"
			}
		})
	};

	const users = await prisma.user.findMany({
		where,
		take: maxEntries || 10,
		select: safeUser
	});

	return (users);

};