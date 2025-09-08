import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
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

	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

	const parts = authHeader.trim().split(/\s+/);
	if (parts.length !== 2 || parts[0]?.toLowerCase() !== "bearer") {
		return res.status(400).json({ message: "Malformed Authorization header" });
	}

	const token = parts[1];

	try {

		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
		const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
		if (!user) return res.status(401).json({ message: "User not found" });

		(req as any).user = stripUserSensitive(user);
		next();

	} catch (err) {

		return res.status(403).json({ message: "Invalid or expired token" });

	};

};
