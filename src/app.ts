import express, { type Application } from "express";
import dotenv from "dotenv";
import router from "./routes";
import { withErrorHandling } from "./utils/withErrorHandling";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use("/api", router);
app.use(withErrorHandling);

export default app;