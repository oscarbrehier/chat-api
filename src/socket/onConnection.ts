import { Socket } from "socket.io";
import { sendMessage } from "../services/messages/sendMessage";
import { getUserChats } from "../services/chat/getUserChats";
import { SafeUser } from "../../types/user";
import { io } from "../server";
import { registerMessageHandler } from "./messageHandler";
import { uploadImage } from "../utils/supabase/uploadImage";

const userSockets: Map<string, Set<string>> = new Map();
const chatRoomsPrefix = "chat_";

function getUserSockets(userId: string) {
	return userSockets.get(userId) || new Set();
};

export function getChatRoom(chatId: string) {
	return `${chatRoomsPrefix}${chatId}`;
};

export async function onSocketConnection(socket: Socket) {

	const { userId, exp } = socket.data.user;

	if (!userId || !exp) {
		socket.emit("unauthorized", "Invalid authentication payload");
		socket.disconnect();
		return;
	};

	const chats = await getUserChats(userId);
	socket.data.userChatIds = chats.map((chat) => chat.id);

	if (!userSockets.has(userId)) {
		userSockets.set(userId, new Set());
	};

	userSockets.get(userId)!.add(socket.id);
	chats.forEach((chat) => socket.join(getChatRoom(chat.id)));

	if (exp) {

		const now = Date.now();
		const delay = exp * 1000 - now;

		if (delay > 0) {

			const expiryTimeout = setTimeout(() => {
				socket.emit("token:refresh-required", "Token expired");
				socket.disconnect();
			}, delay);

			socket.on("disconnect", () => clearTimeout(expiryTimeout));

		};

	};

	socket.on("disconnect", () => {

		const sockets = userSockets.get(userId);

		if (sockets) {

			sockets.delete(socket.id);
			if (sockets.size === 0) {
				userSockets.delete(userId);
			};

		};

	});

	socket.on("message:send", async (chatId, content, imageUrl, callback) => {

		if (!socket.data.userChatIds.includes(chatId)) {
			callback({ success: false, error: "Unauthorized chat access" });
			return;
		};

		try {

			const message = await sendMessage(chatId, userId, content, imageUrl);

			io.to(getChatRoom(chatId)).emit("message:receive", message);
			callback({ success: true, message });

		} catch (err) {

			console.log(err)

			callback({
				success: false,
				message: "Failed to send message",
				error: (err as Error).message
			});

		};

	});

	socket.on("chat:create", async (chatId, creatorId, users, callback) => {

		try {
		
			socket.join(getChatRoom(chatId));
			if (!socket.data.userChatIds.includes(chatId)) {
				socket.data.userChatIds.push(chatId);
			};

			users.forEach((user: SafeUser) => {

				if (user.id === creatorId) return;

				const sockets = getUserSockets(user.id);

				sockets.forEach(socketId => {

					const recipientSocket = io.sockets.sockets.get(socketId);
					if (!recipientSocket) return;

					recipientSocket.join(getChatRoom(chatId));

					if (!recipientSocket.data.userChatIds) {
						recipientSocket.data.userChatIds = [];
					};

					if (!recipientSocket.data.userChatIds.includes(chatId)) {
						recipientSocket.data.userChatIds.push(chatId);
					};

					recipientSocket.emit("chat:created", {
						chatId,
						createdBy: creatorId
					});

				});

			});

			callback({ success: true });

		} catch (err) {

			if (callback) {
				callback({ success: false, error: (err as Error).message });
			};

		};

	});

	registerMessageHandler(socket);

};
