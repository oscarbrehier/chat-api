import supabase from "./client";

export const SIGNED_URL_TTL = 60 * 60; // seconds

export async function getSignedUrl(bucket: string, path: string) {

	const { data: signedUrlData, error: signedUrlError } = await supabase.storage
		.from(bucket)
		.createSignedUrl(path, SIGNED_URL_TTL);

	if (signedUrlError) {
		console.log("Failed to create signed URL:", signedUrlError);
		return null;
	};

	return signedUrlData.signedUrl;

};