import { NextFunction, Request, Response } from "express";
import { refreshAccessToken } from "../../services/auth/refreshAccessToken";
import jwt from "jsonwebtoken";
import { accessTokenLifetime } from "../../utils/constants";

export async function refreshTokenController(req: Request, res: Response, next: NextFunction) {

	try {
		
		let refreshToken = req.cookies?.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "Refresh token missing from request cookies"});
		};

		const decoded = jwt.decode(refreshToken) as jwt.JwtPayload & { userId?: string };
		if (!decoded || !decoded?.userId) return res.status(403).json("Invalid or expired refresh token");

		const {
			valid,
			newAccessToken,
			newRefreshToken
		} = await refreshAccessToken(decoded.userId, (refreshToken as string));

		if (!valid) {
			return res.status(401).json({ message: "Invalid refresh token" });
		};

		const isDev = process.env.NODE_ENV === "development";
		
		res.cookie("accessToken", newAccessToken, {
			httpOnly: true,
			secure: true,
			sameSite: isDev ? "none" : "strict",
			maxAge: accessTokenLifetime * 1000,
			path: "/"
		});

		res.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: isDev ? "none" : "strict",
			maxAge: 30 * 24 * 60 * 60 * 1000,
			path: "/"
		});
		
		res.json({
			success: true
		});

	} catch (err) {
		next(err);
	};

};