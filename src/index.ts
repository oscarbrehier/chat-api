import express, { type Application, type Request, type Response } from "express";
import dotenv from "dotenv";
import router from "./routes";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
