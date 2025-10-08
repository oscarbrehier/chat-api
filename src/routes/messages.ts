import { Router } from "express";
import { authenticateUser } from "../middleware/authenticateUser";
import { sendMessageController } from "../controllers/messages/sendMessage.controllers";
import { getMessageController } from "../controllers/messages/getMessages.controllers";
import { updateMessageController } from "../controllers/messages/updateMessage.controllers";
import { deleteMessageController } from "../controllers/messages/deleteMessage.controllers";

const router = Router();

router.post("/", authenticateUser, sendMessageController);
router.get("/:chatId", authenticateUser, getMessageController);
router.put("/:id", authenticateUser, updateMessageController);
router.delete("/:id", authenticateUser, deleteMessageController);

export default router;