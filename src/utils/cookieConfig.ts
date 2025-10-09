import { CookieOptions } from "express";

export function cookieConfig(maxAge: number | undefined): CookieOptions {

	const isProduction = process.env.NODE_ENV === 'production';

	return {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? 'lax' : 'lax',
		maxAge: maxAge,
		path: "/",
		...(isProduction && { domain: '.yourdomain.com' })
	};

};