import { NextFunction, Request, Response } from "express";
import { getUsers } from "../../services/users/getUsers";

export async function getAllUsersController(req: Request, res: Response, next: NextFunction) {

	try {

		const maxEntries =
			typeof req.query?.maxEntries === "string"
				? parseInt(req.query.maxEntries, 10)
				: 10;

		const excludeUserSelf =
			req.query.excludeUserSelf === "false"
				? false
				: true;

		const excludeUsers = Array.isArray(req.body?.excludeUsers)
			? req.body.excludeUsers
			: typeof req.body?.excludeUsers === "string"
				? [req.body.excludeUsers]
				: [];

		const options = {
			...(typeof req.query?.search === "string" && { searchQuery: req.query.search }),
			maxEntries,
			excludeUserSelf,
			excludeUsers,
		};

		const users = await getUsers(req.user?.id!, options);
		res.status(200).json(users);

	} catch (err) {
		next(err);
	};

};