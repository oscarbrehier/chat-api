import { NextFunction, Request, Response } from "express";
import { login } from "../../services/auth/login.services";
import { accessTokenLifetime } from "../../utils/constants";

export async function loginController(req: Request, res: Response, next: NextFunction) {
	
	try {
		
		const { email, password } = req.body;
		const { user, accessToken, refreshToken } = await login(email, password);
		
		const isProduction = process.env.NODE_ENV === 'production';
		
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
			maxAge: accessTokenLifetime * 1000,
			path: "/",
			domain: isProduction ? '.eggspank.cloud' : undefined
		});

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
			maxAge: 30 * 24 * 60 * 60 * 1000,
			path: "/",
			domain: isProduction ? '.eggspank.cloud' : undefined
		});
		
		res.status(200).json(user);

	} catch (err: any) {
		next(err);
	};

};