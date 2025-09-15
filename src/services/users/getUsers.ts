import { safeUser } from ".";
import prisma from "../../prisma/client";

export async function getUsers(userId: string, query?: string | null, maxEntries?: number) {

	try {

		if (query) {

			const users = await prisma.user.findMany({
				where: {
					id: {
						not: userId
					},
					name: {
						contains: query,
						mode: "insensitive"
					}
				},
				take: maxEntries || 20,
				select: safeUser
			});

			return (users);

		} else {

			const users = await prisma.user.findMany({
				where: {
					id: {
						not: userId
					}
				},
				select: safeUser
			});

			return (users);

		}

	} catch (err) {
		throw err;
	}

};