import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { createChatController } from "../controllers/chat/createChat.controllers";
import { getUserChatsController } from "../controllers/chat/getUserChats.controllers";
import { updateChatController } from "../controllers/chat/updateChat.controllers";
import { getChatController } from "../controllers/chat/getChat.controllers";
import { deleteChatController } from "../controllers/chat/deleteChat.controllers";
import { addUserController } from "../controllers/chat/addUser.controllers";

const router = Router();

router.post("/", authenticateJWT, createChatController);
router.get("/", authenticateJWT, getUserChatsController);
router.get("/:id", authenticateJWT, getChatController);
router.put("/:id", authenticateJWT, updateChatController);
router.delete("/:id", authenticateJWT, deleteChatController);

router.post("/:id/users", authenticateJWT, addUserController);

export default router;