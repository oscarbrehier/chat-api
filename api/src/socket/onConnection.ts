import { Socket } from "socket.io";
import { sendMessage } from "../services/messages/sendMessage";
import { getUserChats } from "../services/chat/getUserChats";

export async function onSocketConnection(socket: Socket) {

	const user = socket.data;
	const chats = await getUserChats(user.id);
	const userChatIds = chats.map((chat) => chat.id);

	chats?.forEach((chat) => socket.join(`chat-${chat.id}`));

	socket.on("message:send", async (chatId, content, callback) => {

		if (!userChatIds.includes(chatId)) {

			callback({
				success: false,
				error: "Unauthorized chat access"
			});
			return;

		}

		try {

			await sendMessage(chatId, user.id, content);
			socket.to(`chat-${chatId}`).emit("message:receive", user.id, content);

			callback({ success: true });

		} catch (err) {

			callback({
				success: false,
				message: "Failed to send message",
				error: (err as Error).message
			});

		}

	});

};