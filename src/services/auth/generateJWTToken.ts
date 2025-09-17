import jwt from "jsonwebtoken";

export function generateJWTTokens(userId: string): { accessToken: string, refreshToken: string } {

	const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
		algorithm: 'HS256',
		expiresIn: 5 * 60
	});

	const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
		algorithm: 'HS256',
		expiresIn: "30d"
	});


	return ({
		accessToken,
		refreshToken
	});

};