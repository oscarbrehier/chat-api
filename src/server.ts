import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app";
import { Server } from "socket.io";
import { onSocketConnection } from "./socket/onConnection";
import { authenticateSocket } from "./socket/authenticateSocket";

dotenv.config();

const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

const server = createServer(app);
export const io = new Server(server,
	{
		cors: {
			origin: isProduction
				? [process.env.FRONTEND_URL as string]
				: "http://localhost:5173",
			credentials: true
		}
	});

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
