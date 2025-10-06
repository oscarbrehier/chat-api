import { getSignedUrl, SIGNED_URL_TTL } from "./getSignedUrl";

const urlCache = new Map<string, { url: string, createdAt: number }>();

export async function getAvatarUrl(path: string) {

	const cached = urlCache.get(path);

	if (cached && Date.now() - cached.createdAt < SIGNED_URL_TTL * 1000) {
		return cached.url;
	};

	const url = await getSignedUrl("avatar", path);
	if (!url) return cached?.url ?? null;

	urlCache.set(path, { url, createdAt: Date.now() });	
	return (url);

};