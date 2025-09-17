export function getTokenFromHeader(authHeader: string) {

	const parts = authHeader.trim().split(/\s+/);
	if (parts.length !== 2 || parts[0]?.toLowerCase() !== "bearer") {
		throw new Error("Malformed Authorization header");
	};

	const token = parts[1] as string;

	return (token);

};