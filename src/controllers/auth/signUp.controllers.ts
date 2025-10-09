import { Request, Response } from "express";
import { register } from "../../services/auth/register.services";
import { accessTokenLifetime } from "../../utils/constants";
import { cookieConfig } from "../../utils/cookieConfig";

export async function signUpController(req: Request, res: Response) {

	try {

		const { email, name, password } = req.body;
		const { user, accessToken, refreshToken } = await register(email, name, password);

		res.cookie("accessToken", accessToken, cookieConfig(accessTokenLifetime * 1000));
		res.cookie("refreshToken", refreshToken, cookieConfig(30 * 24 * 60 * 60 * 1000));

		res.status(201).json(user);

	} catch (err: any) {
		res.status(400).json({ error: err.message });
	};

};