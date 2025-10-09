import { NextFunction, Request, Response } from "express";
import { refreshAccessToken } from "../../services/auth/refreshAccessToken";
import jwt, { JwtAuthPayload } from "jsonwebtoken";
import { accessTokenLifetime } from "../../utils/constants";
import { cookieConfig } from "../../utils/cookieConfig";

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
		
		res.cookie("accessToken", newAccessToken, cookieConfig(accessTokenLifetime * 1000));
		res.cookie("refreshToken", newRefreshToken, cookieConfig(30 * 24 * 60 * 60 * 1000));
		
		res.json({
			success: true
		});

	} catch (err) {
		next(err);
	};

};