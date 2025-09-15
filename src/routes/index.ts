import { Router } from "express";
import authRoutes from "./auth";
import chatRoutes from "./chat";
import messageRouter from "./messages";
import usersRouter from "./users";

const router = Router();

router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/messages", messageRouter);
router.use("/users", usersRouter);

export default router;