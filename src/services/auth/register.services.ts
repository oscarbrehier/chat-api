import bcrypt from "bcrypt";
import prisma from "../../prisma/client";

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

		console.log(user)

		return (user);

	} catch (err) {

		throw err;

	}

};