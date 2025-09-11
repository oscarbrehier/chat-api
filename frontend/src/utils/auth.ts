import type { AstroCookies } from "astro";

type LoginPayload = { email: string; password: string };
type SignUpPayload = { name: string; email: string; password: string };

export async function signUp(payload: { name: string, email: string, password: string }) {

	const { name, email, password } = payload;

	const res = await fetch(`${import.meta.env.API_HOST}/api/auth/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			name, email, password
		})
	});

	const data = await res.json();
	return (data);

};

export async function login(payload: { email: string, password: string }) {

	const { email, password } = payload;

	const res = await fetch(`${import.meta.env.API_HOST}/api/auth/login`, {
		method: "POST",
		body: JSON.stringify({
			email, password
		}),
		headers: {
			"Content-Type": "application/json"
		}
	});

	const data = await res.json();
	return (data);

};

export async function handleAuthAction(
	action: "login" | "signUp",
	payload: LoginPayload | SignUpPayload,
	cookies: AstroCookies
) {

	const actionFn = action === "login"
		? login(payload as LoginPayload)
		: signUp(payload as SignUpPayload);

	try {

		const data = await actionFn;

		if (data?.token) {

			cookies.set("token", data.token, {
				path: "/",
				httpOnly: true,
				secure: false,
				sameSite: "strict",
				maxAge: 60 * 60,
			});

		};

		return (data);

	} catch (err) {

		throw (err);

	};

};

export function logout() {
	localStorage.removeItem("token");
};