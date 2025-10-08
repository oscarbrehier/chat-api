import { User as PrismaUser } from "@prisma/client";

export type SafeUser = Omit<PrismaUser, "password">