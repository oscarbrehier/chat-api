import { NextFunction, Request, Response } from "express";
import { refreshAccessToken } from "../../services/auth/refreshAccessToken";
import { getTokenFromHeader } from "../../utils/getTokenFromBearer";
import jwt from "jsonwebtoken";

export async function refreshTokenController(req: Request, res: Response, next: NextFunction) {

	try {
		
		let refreshToken: string;
		const refreshTokenHeader = req.headers.authorization;
		const expiredAccessToken = req.headers["x-expired-token"];

		if (!refreshTokenHeader) {
			return res.status(401).json({ message: "Authorization header missing. Refresh token required"});
		};

		if (!expiredAccessToken || typeof expiredAccessToken !== "string") {
			return res.status(401).json({ message: "Missing required header: `x-expired-token`" });
		};

		try {
			refreshToken = getTokenFromHeader(refreshTokenHeader);
		} catch (err) {
			console.error(err);
			return res.status(400).json({ message: "Invalid Authorization header" })
		};

		const decoded = jwt.decode(expiredAccessToken) as jwt.JwtPayload & { userId?: string };
		if (!decoded || !decoded?.userId) return res.status(403).json("Invalid expired access token");

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
			secure: !isDev,
			sameSite: "strict",
			maxAge: 5 * 60 * 1000,
			path: "/"
		});

		res.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: !isDev,
			sameSite: "strict",
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