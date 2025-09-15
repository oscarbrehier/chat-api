import { Socket } from "socket.io";
import { sendMessage } from "../services/messages/sendMessage";
import { getUserChats } from "../services/chat/getUserChats";

export async function onSocketConnection(socket: Socket) {

	const {user} = socket.data;
	const chats = await getUserChats(user.id);
	const userChatIds = chats.map((chat) => chat.id);

	chats?.forEach((chat) => socket.join(`chat-${chat.id}`));

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

			const message = await sendMessage(chatId, user.userId, content);
			socket.to(`chat-${chatId}`).emit("message:receive", message);

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

};