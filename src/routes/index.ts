import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const routesDir = __dirname;

fs.readdirSync(routesDir).forEach((file) => {

	if (file.startsWith("index.")) return;
	if (!file.endsWith(".ts") && !file.endsWith(".js")) return;

	const routePath = path.join(routesDir, file);
	const route = require(routePath).default;

	if (!route) return ;

	const routeName = `/${path.parse(file).name}`;
	router.use(routeName, route);

});

export default router;