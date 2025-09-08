import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";

export async function login(email: string, password: string) {

	try {

		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (!user) throw new Error("User not found");

		const passwordMatch = bcrypt.compare(user.password, password);

		if (!passwordMatch) throw new Error("Invalid password");

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

		return {
			user, token
		};

	} catch (err) {

		throw err;

	};

};