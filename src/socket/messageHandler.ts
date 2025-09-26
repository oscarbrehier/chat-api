import { Socket } from "socket.io";
import prisma from "../prisma/client";
import { markAsRead } from "../services/messages/markAsRead";
import { io } from "../server";
import { getChatRoom } from "./onConnection";

export function registerMessageHandler(socket: Socket) {

	const userId = socket.data.user.id;

	socket.on("message:seen", async ({ chatId, messageId, userId }) => {

		try {

			await markAsRead(chatId, messageId, userId);
			io.to(getChatRoom(chatId)).emit("message:seen", { messageId, userId });

		} catch (err) {
			
		};

	});

};