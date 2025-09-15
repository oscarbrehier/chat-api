import { NextFunction, Request, Response } from "express";
import { getUsers } from "../../services/users/getUsers";

export async function getAllUsersController(req: Request, res: Response, next: NextFunction) {

	try {

		const searchQuery = typeof req.query?.search === "string" ? req.query.search : null;
		const maxEntries =
			typeof req.query?.maxEntries === "string"
				? parseInt(req.query.maxEntries, 10)
				: 0;

		const users = await getUsers(req.user?.id!, searchQuery, maxEntries);
		res.status(200).json(users);

	} catch (err) {
		next(err);
	};

};