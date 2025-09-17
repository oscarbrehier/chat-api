import { Router } from "express";
import { authenticateAccessToken } from "../middleware/authenticateAccessToken";
import { sendMessageController } from "../controllers/messages/sendMessage.controllers";
import { getMessageController } from "../controllers/messages/getMessages.controllers";
import { updateMessageController } from "../controllers/messages/updateMessage.controllers";
import { deleteMessageController } from "../controllers/messages/deleteMessage.controllers";

const router = Router();

router.post("/", authenticateAccessToken, sendMessageController);
router.get("/:chatId", authenticateAccessToken, getMessageController);
router.put("/:id", authenticateAccessToken, updateMessageController);
router.delete("/:id", authenticateAccessToken, deleteMessageController);

export default router;