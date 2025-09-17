import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, type Secret } from "jsonwebtoken";
import prisma from "../prisma/client";
import { User } from "../generated/prisma";
import { getTokenFromHeader } from "../utils/getTokenFromBearer";

interface DecodedToken extends JwtPayload {
	userId: string;
}

function stripUserSensitive(user: User) {

	const { password, ...safeUser } = user;
	return (safeUser);

};

export async function authenticateAccessToken(req: Request, res: Response, next: NextFunction) {

	let token: string | undefined;
	const authHeader = req.headers.authorization;

	if (authHeader) {

		try {
			token = getTokenFromHeader(authHeader);
		} catch (err) {
			console.error(err);
			return res.status(400).json({ message: "Invalid Authorization header" })
		};

	};

	if (!token && req.cookies?.accessToken) {
		token = req.cookies.accessToken;
	};

	if (!token) {
		return res.status(401).json({ message: "Authorization header missing" });
	};

	const secret: Secret = (process.env.JWT_SECRET ?? "test-secret") as Secret;

	try {

		const decoded = jwt.verify(token, secret) as JwtPayload & { userId?: string };
		if (!decoded?.userId) return res.status(403).json({ message: "Invalid or expired token" });
		const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
		if (!user) return res.status(401).json({ message: "User not found" });

		(req as any).user = stripUserSensitive(user);
		next();

	} catch (err) {

		return res.status(403).json({ message: "Invalid or expired token" });

	};

};
