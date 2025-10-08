import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";
import { generateJWTTokens } from "./generateJWTToken";
import { storeRefreshToken } from "./storeRefreshToken";
import { safeUser } from "../users";

export async function register(email: string, name: string, password: string) {

	try {

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword
			},
			select: safeUser
		});

		const { accessToken, refreshToken } = await prisma.$transaction(async (tx) => {

			const { accessToken, refreshToken } = generateJWTTokens(user.id);
			await storeRefreshToken(user.id, refreshToken, tx);

			return {
				accessToken,
				refreshToken
			};

		});

		return {
			user,
			accessToken,
			refreshToken
		};

	} catch (err) {

		throw err;

	}

};