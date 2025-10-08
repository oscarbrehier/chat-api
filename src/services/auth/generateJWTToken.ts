import jwt from "jsonwebtoken";
import { accessTokenLifetime } from "../../utils/constants";

export function generateJWTTokens(userId: string): { accessToken: string, refreshToken: string } {

	const accessToken = jwt.sign({ userId, type: "access" }, process.env.JWT_SECRET!, {
		algorithm: 'HS256',
		expiresIn: accessTokenLifetime
	});

	const refreshToken = jwt.sign({ userId, type: "refresh" }, process.env.JWT_SECRET!, {
		algorithm: 'HS256',
		expiresIn: "30d"
	});


	return ({
		accessToken,
		refreshToken
	});

};