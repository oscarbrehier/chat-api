import jwt from "jsonwebtoken";
import * as cookie from "cookie";

import { Socket } from "socket.io";

export function authenticateSocket(socket: Socket) {

	const rawCookie = socket.handshake.headers.cookie;
	if (!rawCookie) throw new Error("No cookies found in handshake headers");

	const parsed = cookie.parse(rawCookie);
	const token = parsed["accessToken"];

	if (!token) {
		throw new Error("Missing access token in cookies");
	};

	try {

		const payload = jwt.verify(token, process.env.JWT_SECRET!);
		socket.data.user = payload;

	} catch (err) {
		throw new Error("Invalid or expired access token");
	};

};