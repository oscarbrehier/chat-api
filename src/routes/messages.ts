import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { sendMessageController } from "../controllers/messages/sendMessage.controllers";
import { getMessageController } from "../controllers/messages/getMessages.controllers";
import { updateMessageController } from "../controllers/messages/updateMessage.controllers";
import { deleteMessageController } from "../controllers/messages/deleteMessage.controllers";

const router = Router();

router.post("/", authenticateJWT, sendMessageController);
router.get("/:chatId", authenticateJWT, getMessageController);
router.put("/:id", authenticateJWT, updateMessageController);
router.delete("/:id", authenticateJWT, deleteMessageController);

export default router;