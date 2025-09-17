import { Router } from "express";
import { authenticateAccessToken } from "../middleware/authenticateAccessToken";
import { createChatController } from "../controllers/chat/createChat.controllers";
import { getUserChatsController } from "../controllers/chat/getUserChats.controllers";
import { updateChatController } from "../controllers/chat/updateChat.controllers";
import { getChatController } from "../controllers/chat/getChat.controllers";
import { deleteChatController } from "../controllers/chat/deleteChat.controllers";
import { addUserController } from "../controllers/chat/addUser.controllers";

const router = Router();

router.post("/", authenticateAccessToken, createChatController);
router.get("/", authenticateAccessToken, getUserChatsController);
router.get("/:id", authenticateAccessToken, getChatController);
router.put("/:id", authenticateAccessToken, updateChatController);
router.delete("/:id", authenticateAccessToken, deleteChatController);

router.post("/:id/users", authenticateAccessToken, addUserController);

export default router;