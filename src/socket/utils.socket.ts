import { io } from "../server";
import { getChatRoom } from "./onConnection";

export function emitToRoom(chatId: string, event: string, ...args: any[]): void {
	io.to(getChatRoom(chatId)).emit(event, ...args);
};