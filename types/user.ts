import { User as PrismaUser } from "../src/generated/prisma";

export type SafeUser = Omit<PrismaUser, "password">