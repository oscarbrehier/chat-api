import { createServer } from "http";
import app from "./app";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { getUserChats } from "./services/chat/getUserChats";
import { sendMessage } from "./services/messages/sendMessage";
import { onSocketConnection } from "./socket/onConnection";

const port = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173", credentials: true } });

io.use((socket, next) => {

	const rawCookie = socket.handshake.headers.cookie;
	if (!rawCookie) return next(new Error("Authentication failed: no cookie found"));

	const parsed = cookie.parse(rawCookie);
	const token = parsed["token"];

	if (!token) {
		return next(new Error("Authentication failed: missing token"));
	};

	try {

		const payload = jwt.verify(token, process.env.JWT_SECRET!);
		socket.data.user = payload;
		next();

	} catch (err) {

		return next(new Error("Authentication failed: Invalid token"));

	};

});

io.on("connection", onSocketConnection);

server.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
