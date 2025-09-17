import bcrypt from "bcrypt";
import prisma from "../../prisma/client";
import { NotFoundError, UnauthorizedError } from "../../utils/errors";
import { generateJWTTokens } from "./generateJWTToken";
import { storeRefreshToken } from "./storeRefreshToken";

export async function login(email: string, password: string) {

	const user = await prisma.user.findUnique({
		where: {
			email
		}
	});

	if (!user) throw new NotFoundError("User not found");

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (!passwordMatch) throw new UnauthorizedError("Invalid password");

	const { accessToken, refreshToken } = await prisma.$transaction(async (tx) => {

		const { accessToken, refreshToken } = generateJWTTokens(user.id);
		await storeRefreshToken(user.id, refreshToken, tx);

		return {
			accessToken,
			refreshToken
		};

	});

	const { password: storedPassword, ...safeUser } = user;

	return {
		user: safeUser,
		accessToken,
		refreshToken
	};

};