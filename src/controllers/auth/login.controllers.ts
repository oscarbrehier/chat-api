import { NextFunction, Request, Response } from "express";
import { login } from "../../services/auth/login.services";


export async function loginController(req: Request, res: Response, next: NextFunction) {
	
	try {
		
		const { email, password } = req.body;
		const { user, accessToken, refreshToken } = await login(email, password);
		
		const isDev = process.env.NODE_ENV === "development";
		
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: !isDev,
			sameSite: "strict",
			maxAge: 5 * 60 * 1000,
			path: "/"
		});

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: !isDev,
			sameSite: "strict",
			maxAge: 30 * 24 * 60 * 60 * 1000,
			path: "/"
		});
		
		res.status(200).json(user);

	} catch (err: any) {
		next(err);
	};

};