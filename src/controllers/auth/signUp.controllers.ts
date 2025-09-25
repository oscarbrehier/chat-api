import { Request, Response } from "express";
import { register } from "../../services/auth/register.services";
import { accessTokenLifetime } from "../../utils/constants";

export async function signUpController(req: Request, res: Response) {

	try {

		const { email, name, password } = req.body;
		const { user, accessToken, refreshToken } = await register(email, name, password);

		const isDev = process.env.NODE_ENV === "development";

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: isDev ? "none" : "strict",
			maxAge: accessTokenLifetime * 1000,
			path: "/"
		});

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: isDev ? "none" : "strict",
			maxAge: 30 * 24 * 60 * 60 * 1000,
			path: "/"
		});

		res.status(201).json(user);

	} catch (err: any) {
		res.status(400).json({ error: err.message });
	};

};