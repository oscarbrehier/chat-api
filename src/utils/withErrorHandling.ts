import { NextFunction, Request, Response } from "express";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./errors";

export async function withErrorHandling(err: any, req: Request, res: Response, next: NextFunction) {

	let statusCode = 500;

	if (err instanceof BadRequestError) statusCode = 400;
	if (err instanceof UnauthorizedError) statusCode = 401;
	if (err instanceof ForbiddenError) statusCode = 403;
	if (err instanceof NotFoundError) statusCode = 404;

	if (err !== 500) return res.status(statusCode).json({ error: err.message });
	res.status(500).json({ error: "Internal server error" });

};