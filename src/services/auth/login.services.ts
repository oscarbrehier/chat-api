import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";
import { NotFoundError, UnauthorizedError } from "../../utils/errors";

export async function login(email: string, password: string) {

	try {

		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (!user) throw new NotFoundError("User not found");


		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) throw new UnauthorizedError("Invalid password");


		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });

		return {
			user, token
		};

	} catch (err) {

		throw err;

	};

};