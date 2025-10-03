import prisma from "../../../prisma/client";

export async function setUserAvatar(userId: string, path: string) {

	const user = await prisma.user.update({
		where: { id: userId },
		data: {
			avatarPath: path
		}
	});

	return user;

};