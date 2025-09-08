import { Request, Response } from "express";
import { login } from "../../services/auth/login.services";

export async function loginController(req: Request, res: Response) {

	try {

		const { email, password } = req.body;
		const result = await login(email, password);
		
		res.status(200).json(result);

	} catch (err: any) {

		res.status(400).json({ message: err.message });

	};

};