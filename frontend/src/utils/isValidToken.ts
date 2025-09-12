import { jwtVerify, type JWTPayload } from "jose";

async function getSecretKey() {

	const secret = import.meta.env.JWT_SECRET;
	return await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(secret),
		{ name: "HMAC", hash: "SHA-256"},
		false,
		["verify"]
	);

};

export async function validateToken(token: string): Promise<{ valid: boolean, payload?: JWTPayload }> {

	try {

		const secret = await getSecretKey();
		const { payload } = await jwtVerify(token, secret, {
			algorithms: ["HS256"]
		});	

		return {
			valid: true,
			payload
		}

	} catch (err) {

		console.log(err)

		return {
			valid: false
		};

	};

};