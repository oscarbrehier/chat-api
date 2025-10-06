import { safeUser } from "..";
import prisma from "../../../prisma/client";
import { getSignedUrl } from "../../../utils/supabase/getSignedUrl";
import { getAvatarUrl } from "../../../utils/supabase/getAvatarUrl";

export async function getMe(userId: string) {

	let avatarUrl;

	const user = await prisma.user.findUnique({ 
		where: { id : userId },
		select: safeUser
	});

	if (user && user.avatarPath) {
		avatarUrl = await getAvatarUrl(user.avatarPath);
	};

	return {
		...user,
		avatarUrl
	};

};