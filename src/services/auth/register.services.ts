import bcrypt from "bcrypt";
import prisma from "../../prisma/client";
import jwt from "jsonwebtoken";

export async function register(email: string, name: string, password: string) {

	try {

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword
			}
		});

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

		return {
			user,
			token
		};

	} catch (err) {

		throw err;

	}

};