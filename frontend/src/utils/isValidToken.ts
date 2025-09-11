export async function validateToken(token: string): Promise<boolean> {

	const res = await fetch(`${import.meta.env.API_HOST}/api/auth/me`, {
		headers: {
			"Authorization": `Bearer ${token}`
		},
	});

	return (res.ok ? true : false);
};