import { Router } from "express";
import authRoutes from "./auth";
import chatRoutes from "./chat";
import messageRouter from "./messages";

const router = Router();

router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/messages", messageRouter);

export default router;