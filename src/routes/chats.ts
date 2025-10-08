import { Router } from "express";
import { authenticateUser } from "../middleware/authenticateUser";
import { createChatController } from "../controllers/chat/createChat.controllers";
import { getUserChatsController } from "../controllers/chat/getUserChats.controllers";
import { updateChatController } from "../controllers/chat/updateChat.controllers";
import { getChatController } from "../controllers/chat/getChat.controllers";
import { deleteChatController } from "../controllers/chat/deleteChat.controllers";
import { addUserController } from "../controllers/chat/addUser.controllers";

const router = Router();

router.post("/", authenticateUser, createChatController);
router.get("/", authenticateUser, getUserChatsController);
router.get("/:id", authenticateUser, getChatController);
router.put("/:id", authenticateUser, updateChatController);
router.delete("/:id", authenticateUser, deleteChatController);

router.post("/:id/users", authenticateUser, addUserController);

export default router;