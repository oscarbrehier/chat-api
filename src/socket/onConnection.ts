import { Socket } from "socket.io";
import { sendMessage } from "../services/messages/sendMessage";
import { getUserChats } from "../services/chat/getUserChats";
import { SafeUser } from "../../types/user";
import { io } from "../server";

const userSockets: Map<string, Set<string>> = new Map();
const chatRoomsPrefix = "chat_";

function getUserSockets(userId: string) {
	return userSockets.get(userId) || new Set();
};

function getChatRoom(chatId: string) {
	return `${chatRoomsPrefix}${chatId}`;
};

export async function onSocketConnection(socket: Socket) {

	const { userId } = socket.data.user;
	const chats = await getUserChats(userId);
	const userChatIds = chats.map((chat) => chat.id);

	if (!userSockets.has(userId)) {
		userSockets.set(userId, new Set());
	};

	userSockets.get(userId)!.add(socket.id);

	chats?.forEach((chat) => socket.join(getChatRoom(chat.id)));

	socket.on("disconnect", () => {

		userSockets.forEach((sockets, userId) => {
			sockets.delete(socket.id);
			if (sockets.size === 0) {
				userSockets.delete(userId);
			};
		});

	});

	socket.on("message:send", async (chatId, content, callback) => {

		console.log("Received message", chatId, content);

		if (!userChatIds.includes(chatId)) {

			callback({
				success: false,
				error: "Unauthorized chat access"
			});
			return;

		}

		try {

			const message = await sendMessage(chatId, userId, content);
			socket.to(getChatRoom(chatId)).emit("message:receive", message);

			callback({
				success: true,
				message
			});

		} catch (err) {

			console.log(err)

			callback({
				success: false,
				message: "Failed to send message",
				error: (err as Error).message
			});

		}

	});

	socket.on("chat:create", async (chatId, creatorId, users, callback) => {

		try {

			users.forEach((user: SafeUser) => {

				const userSocket = getUserSockets(user.id);

				if (userSocket.size > 0) {
					userSocket.forEach(socketId => {
						io.to(socketId).socketsJoin(getChatRoom(chatId));
						io.to(socketId).emit("chat:created", {
							chatId,
							createdBy: creatorId
						});
					});
				};

			});

			callback({
				success: true
			});

		} catch (err) {

			if (callback) callback({
				success: false,
				error: (err as Error).message
			})

		};

	});

};