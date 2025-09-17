import prisma from "../../prisma/client";

export async function getExistingDM(currentUserId: string, otherUserId: string) {

	const chat = await prisma.chat.findFirst({
		where: {
			type: "dm",
			AND: [
				{ users: { some: { id: currentUserId } } },
				{ users: { some: { id: otherUserId } } },
				{ 
                    users: { 
                        none: { 
                            id: { 
                                notIn: [currentUserId, otherUserId] 
                            } 
                        } 
                    } 
                }
			]
		}
	});

	return (chat);

};