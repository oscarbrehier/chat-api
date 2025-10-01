import { Socket } from "socket.io";
import prisma from "../prisma/client";
import { markAsRead } from "../services/messages/markAsRead";
import { io } from "../server";
import { getChatRoom } from "./onConnection";
import { addMessageReaction } from "../services/messages/addReaction";

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


			console.log("received reaction for", chatId, messageId, userId, emoji);
			const result = await addMessageReaction(messageId, userId, emoji);
			
			console.log("result", result)

			if (result.added) {
				io.to(getChatRoom(chatId)).emit("message:reaction", { messageId, reaction: result.reaction });

			} else {
				io.to(getChatRoom(chatId)).emit("message:reaction-removed", { messageId, userId, emoji });
			}

		} catch (err) {
			console.log(err)
		};

	});

};