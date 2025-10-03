import { randomUUID, sign } from "crypto";
import supabase from "./client";
import { getSignedUrl } from "./getSignedUrl";

function base64ToBuffer(base64: string): Buffer {
	const base64Data = base64.replace(/^data:.*;base64,/, '');
	return Buffer.from(base64Data, 'base64');
}

export async function uploadImage(file: Express.Multer.File, bucket: string, uniqueId: string, signed: boolean = false): Promise<{ url?: string, path?: string, error?: string }> {

	const safeName = file.originalname.replace(/\s+/g, "_");
	const uniqueName = `${Date.now()}-${randomUUID()}-${safeName}`;
	const path = `${uniqueId}/${uniqueName}`;

	const { data, error } = await supabase.storage
		.from(bucket)
		.upload(path, file.buffer, {
			cacheControl: "3600",
			upsert: false
		});

	if (error) {
		return { error: error.message };
	};

	if (signed) {

		// const { data: signedUrlData, error: signedUrlError } = await supabase.storage
		// 	.from(bucket)
		// 	.createSignedUrl(data.path, 60);

		// if (signedUrlError) {
		// 	return { error: signedUrlError.message };
		// };

		// return {
		// 	url: signedUrlData.signedUrl,
		// 	path: data.path
		// };

		const signedUrl = await getSignedUrl(bucket, data.path);
		if (!signedUrl) {
			return { error: `Failed to create signed URL for \`${bucket}\`` };
		};

		return {
			path: data.path,
			url: signedUrl,
		};

	};

	const { data: publicUrlData } = supabase.storage
		.from(bucket)
		.getPublicUrl(path);

	const publicUrl = publicUrlData.publicUrl;
	return {
		url: publicUrl
	};

};