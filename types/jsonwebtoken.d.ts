import * as jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
	export interface JwtAuthPayload extends jwt.JwtPayload {
		userId?: string;
		type: "access" | "refresh";
	};
};