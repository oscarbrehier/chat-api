import { CookieOptions } from "express";

export function cookieConfig(maxAge: number | undefined): CookieOptions {

	const isProduction = process.env.NODE_ENV === 'production';

	return {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
		maxAge: maxAge,
		path: "/",
		...(isProduction && { domain: '.eggspank.cloud' })
	};

};