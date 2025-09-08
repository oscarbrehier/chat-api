import { Request, Response } from "express";
import { register } from "../../services/auth/register.services";

export async function signUpController(req: Request, res: Response) {

	try {

		const { email, name, password } = req.body;
		const user = await register(email, name, password);
		
		res.status(201).json(user);

	} catch (err: any) {

		res.status(400).json({ error: err.message });

	}

};