import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies, redirect, request }) => {

	const formData = Object.fromEntries(new URLSearchParams(await request.text()));
	const { email, password } = formData;

	const res = await fetch(`http://localhost:3000/api/auth/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email, password
		})
	});

	if (!res.ok) {
		return redirect("/login?error=true", 303);
	};

	const data = await res.json();

	cookies.set("token", data.token, {
		path: "/",
		maxAge: 3600 * 1000,
		secure: true
	});

	return redirect("/");

};