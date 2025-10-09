import { Request, Response } from "express";
import { register } from "../../services/auth/register.services";
import { accessTokenLifetime } from "../../utils/constants";

export async function signUpController(req: Request, res: Response) {

	try {

		const { email, name, password } = req.body;
		const { user, accessToken, refreshToken } = await register(email, name, password);

		const isProduction = process.env.NODE_ENV === 'production';

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'lax' : 'none',
			maxAge: accessTokenLifetime * 1000,
			path: "/",
			domain: isProduction ? '.eggspank.cloud' : undefined
		});

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'lax' : 'none',
			maxAge: 30 * 24 * 60 * 60 * 1000,
			path: "/",
			domain: isProduction ? '.eggspank.cloud' : undefined
		});

		res.status(201).json(user);

	} catch (err: any) {
		res.status(400).json({ error: err.message });
	};

};