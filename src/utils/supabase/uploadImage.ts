import supabase from "./client";

function base64ToBuffer(base64: string): Buffer {
	const base64Data = base64.replace(/^data:.*;base64,/, '');
	return Buffer.from(base64Data, 'base64');
}

export async function uploadImage(fileBuffer: Buffer, bucket: string, path: string): Promise<string | null> {

	const { data, error } = await supabase.storage
		.from(bucket)
		.upload(path, fileBuffer, {
			cacheControl: "3600",
			upsert: false
		});

	if (error) {
		console.log("Upload failed: ", error);
		return null;
	};

	const { data: publicUrlData } = supabase.storage
		.from(bucket)
		.getPublicUrl(path);

	const publicUrl = publicUrlData.publicUrl;
	return publicUrl;

};