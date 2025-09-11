import { createServer } from "http";
import app from "./app";
import { Server } from "socket.io";

const port = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
	console.log("a user connected");
});

server.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
