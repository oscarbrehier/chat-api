// types/express.d.ts
import { User as PrismaUser } from "../src/generated/prisma";

declare global {
	namespace Express {
		interface Request {
			user?: Omit<User, "password">;
		}
	}
}