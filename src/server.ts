import { createServer } from "http";
import app from "./app";
import { Server } from "socket.io";
import { onSocketConnection } from "./socket/onConnection";
import { authenticateSocket } from "./socket/authenticateSocket";

const port = process.env.PORT || 3000;

const server = createServer(app);
export const io = new Server(server, { cors: { origin: "http://localhost:5173", credentials: true } });

io.use((socket, next) => {

	try {

		authenticateSocket(socket);
		next();

	} catch (err) {
		return next((err as Error));
	};

});

io.on("connection", onSocketConnection);

server.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
