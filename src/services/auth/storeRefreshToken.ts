import { PrismaClient } from "@prisma/client";

type TransactionClient = Omit<
	PrismaClient,
	"$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

export async function storeRefreshToken(
	userId: string,
	refreshToken: string,
	tx: TransactionClient
) {

	try {

		await tx.refreshToken.create({
			data: {
				userId,
				token: refreshToken,
				expiryAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			}
		});


	} catch (err) {

		console.error("Failed to store refresh token: ", err);
		throw new Error("Failed to store refresh token");

	};

};