import prisma from "../../../prisma/client";
import { getAvatarUrl } from "../../../utils/supabase/getAvatarUrl";

export async function getAvatar(userId: string): Promise<string | null> {

	const user = await prisma.user.findUnique({ where: { id: userId }});
	if (!user || !user.avatarPath) return null;

	const avatarUrl = await getAvatarUrl(user.avatarPath);
	return avatarUrl;

};