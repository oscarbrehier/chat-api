import { NextFunction, Request, Response } from "express";
import { refreshAccessToken } from "../../services/auth/refreshAccessToken";
import jwt, { JwtAuthPayload } from "jsonwebtoken";
import { accessTokenLifetime } from "../../utils/constants";

export async function refreshTokenController(req: Request, res: Response, next: NextFunction) {

	try {
		
		let refreshToken = req.cookies?.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "Refresh token missing from request cookies"});
		};

		const decoded = jwt.decode(refreshToken) as JwtAuthPayload;
		if (!decoded || !decoded?.userId) return res.status(403).json({ message: "Invalid or expired refresh token" });
		if (decoded.type !== "refresh") return res.status(403).json({ message: "Invalid token type" });

		const {
			valid,
			newAccessToken,
			newRefreshToken
		} = await refreshAccessToken(decoded.userId, (refreshToken as string));

		if (!valid) {
			return res.status(401).json({ message: "Invalid refresh token" });
		};

		const isProduction = process.env.NODE_ENV === 'production';
		
		res.cookie("accessToken", newAccessToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
			maxAge: accessTokenLifetime * 1000,
			path: "/",
			domain: isProduction ? '.eggspank.cloud' : undefined
		});

		res.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
			maxAge: 30 * 24 * 60 * 60 * 1000,
			path: "/",
			domain: isProduction ? '.eggspank.cloud' : undefined
		});
		
		res.json({
			success: true
		});

	} catch (err) {
		next(err);
	};

};