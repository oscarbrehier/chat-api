import supabase from "./client";

export async function getSignedUrl(bucket: string, path: string) {

	const { data: signedUrlData, error: signedUrlError } = await supabase.storage
		.from(bucket)
		.createSignedUrl(path, 60);

	if (signedUrlError) {
		console.log("Failed to create signed URL:", signedUrlError);
		return null;
	};

	return signedUrlData.signedUrl;

};