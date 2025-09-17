import express, { type Application } from "express";
import dotenv from "dotenv";
import router from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { withErrorHandling } from "./utils/withErrorHandling";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
	origin: "http://localhost:5173",
	credentials: true
}));
app.use("/api", router);
app.use(withErrorHandling);

export default app;