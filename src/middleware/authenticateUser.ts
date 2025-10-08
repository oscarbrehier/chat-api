import { NextFunction, Request, Response } from "express";
import jwt, { JwtAuthPayload, JwtPayload, type Secret } from "jsonwebtoken";
import prisma from "../prisma/client";
import { User } from "../generated/prisma";
import { getTokenFromHeader } from "../utils/getTokenFromBearer";
import { HttpError } from "../utils/errors";

function stripUserSensitive(user: User) {
	const { password, ...safeUser } = user;
	return (safeUser);
};

function verifyToken(token: string, expectedType = "access"): JwtAuthPayload {

	const secret: Secret = (process.env.JWT_SECRET ?? "test-secret") as Secret;

	let decoded;

	try {
		decoded = jwt.verify(token, secret) as JwtAuthPayload;
	} catch (err) {
		throw new HttpError("Invalid or expired token", 403);
	};

	if (decoded.type !== expectedType) {
		throw new HttpError(`Invalid token type: expected ${expectedType}`, 403);
	};

	if (!decoded.userId) {
		throw new HttpError(`Token payload missing userId`, 403);
	}

	return decoded;

};

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {

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

	try {

		const decoded = verifyToken(token, "access");

		const user = await prisma.user.findUnique({ where: { id: decoded.userId! } });
		if (!user) return res.status(401).json({ message: "User not found" });

		(req as Request).user = stripUserSensitive(user);
		next();

	} catch (err) {

		const status = err instanceof Error && "status" in err ? (err as any).status : 403;
		return res.status(status).json({ message: (err as Error).message });

	};

};
