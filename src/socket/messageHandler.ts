import { Socket } from "socket.io";
import prisma from "../prisma/client";
import { markAsRead } from "../services/messages/markAsRead";
import { io } from "../server";
import { getChatRoom } from "./onConnection";
import { addMessageReaction } from "../services/messages/addReaction";
import { deleteMessage } from "../services/messages/deleteMessage";
import { NotFoundError } from "../utils/errors";
import { emitToRoom } from "./utils.socket";

export function registerMessageHandler(socket: Socket) {

	const userId = socket.data.user.id;

	socket.on("message:seen", async ({ chatId, messageId, userId }) => {

		try {

			await markAsRead(chatId, messageId, userId);
			io.to(getChatRoom(chatId)).emit("message:seen", { messageId, userId });

		} catch (err) {
			
		};

	});

	socket.on("message:reaction", async ({ chatId, messageId, userId, emoji }) => {

		try {

			const result = await addMessageReaction(messageId, userId, emoji);

			if (result.added) {
				io.to(getChatRoom(chatId)).emit("message:reaction", { messageId, reaction: result.reaction });

			} else {
				io.to(getChatRoom(chatId)).emit("message:reaction-removed", { messageId, userId, emoji });
			}

		} catch (err) {
			console.log(err)
		};

	});

	socket.on("message:delete", async ({ messageId, userId }, callback) => {

		try {

			const deleted = await deleteMessage(messageId, userId);
			callback({ deleted: true });
			io.to(getChatRoom(deleted.chatId)).emit("message:delete", messageId);

		} catch (err) {

			if (err instanceof NotFoundError) {
				callback({ deleted: false, error: "Message not found or unauthorized" });
			} else {
				callback({ deleted: false, error: "Failed to delete message" });
			};

			console.log("Failed to delete message: ", (err as Error).message);

		};

	});

	socket.on("message:typing", ({ chatId, userId, isTyping }) => {
		emitToRoom(chatId, "message:typing", { userId, isTyping });
	});

};