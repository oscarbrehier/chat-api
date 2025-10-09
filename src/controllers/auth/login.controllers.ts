import { NextFunction, Request, Response } from "express";
import { login } from "../../services/auth/login.services";
import { accessTokenLifetime } from "../../utils/constants";
import { cookieConfig } from "../../utils/cookieConfig";

export async function loginController(req: Request, res: Response, next: NextFunction) {
	
	try {
		
		const { email, password } = req.body;
		const { user, accessToken, refreshToken } = await login(email, password);
		
		res.cookie("accessToken", accessToken, cookieConfig(accessTokenLifetime * 1000));
		res.cookie("refreshToken", refreshToken, cookieConfig(30 * 24 * 60 * 60 * 1000));
		
		res.status(200).json(user);

	} catch (err: any) {
		next(err);
	};

};