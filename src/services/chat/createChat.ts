import { SafeUser } from "../../../types/user";
import prisma from "../../prisma/client";
import { BadRequestError } from "../../utils/errors";

type ChatOptions = {
	users?: SafeUser[];
	type?: "dm" | "group";
};

export async function createChat(
	name: string, 
	userId: string, 
	options: ChatOptions = {}
) {

	let userIdList = [{
		id: userId
	}];

	if (options?.users?.length) {
		const additionalUsers = options.users.map(user => ({ id: user.id }));
    	userIdList.push(...additionalUsers);
	};

	const chat = await prisma.chat.create({
		data: {
			...(name && { name: name.trim() }),
			...(options?.type && { type: options.type }),
			users: {
				connect: userIdList
			}
		}
	});

	return (chat);

};