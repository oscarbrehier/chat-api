import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, type Secret } from "jsonwebtoken";
import prisma from "../prisma/client";
import { User } from "../generated/prisma";

interface DecodedToken extends JwtPayload {
	userId: string;
}

function stripUserSensitive(user: User) {

	const { password, ...safeUser } = user;
	return (safeUser);

};

export async function authenticateJWT(req: Request, res: Response, next: NextFunction) {

	let token: string | undefined;

	const authHeader = req.headers.authorization;
	// if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

	if (authHeader) {

		const parts = authHeader.trim().split(/\s+/);
		if (parts.length !== 2 || parts[0]?.toLowerCase() !== "bearer") {
			return res.status(400).json({ message: "Malformed Authorization header" });
		}

		token = parts[1] as string;

	};

	if (!token && req.cookies?.token) {
		token = req.cookies.token;
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
