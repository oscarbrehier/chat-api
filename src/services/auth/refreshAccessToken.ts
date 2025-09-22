import prisma from "../../prisma/client";
import { UnauthorizedError } from "../../utils/errors";
import { generateJWTTokens } from "./generateJWTToken";
import { storeRefreshToken } from "./storeRefreshToken";

export async function refreshAccessToken(userId: string, refreshToken: string) {

	try {

		const { newAccessToken, newRefreshToken } = await prisma.$transaction(async (tx) => {

			const storedRefreshToken = await tx.refreshToken.findUnique({
				where: {
					token: refreshToken
				}
			});

			if (
				!storedRefreshToken ||
				storedRefreshToken?.isRevoked ||
				storedRefreshToken.expiryAt < new Date() ||
				storedRefreshToken.userId !== userId
			) {

				await tx.refreshToken.update({
					where: {
						token: refreshToken
					},
					data: {
						isRevoked: true,
						revokedAt: new Date()
					}
				});

				throw new UnauthorizedError("Invalid refresh token");

			};

			const {
				accessToken,
				refreshToken: newRefreshToken
			} = generateJWTTokens(userId);

			await tx.refreshToken.update({
				where: {
					token: refreshToken
				},
				data: {
					isRevoked: true,
					revokedAt: new Date()
				}
			});

			await storeRefreshToken(userId, newRefreshToken, tx);

			return {
				newAccessToken: accessToken,
				newRefreshToken
			};

		});

		return {
			valid: true,
			newAccessToken,
			newRefreshToken
		};

	} catch (err) {

		return {
			valid: false,
			error: err instanceof Error ? err.message : "Failed to refresh token"
		};

	};

};