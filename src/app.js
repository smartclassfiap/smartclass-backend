import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import cors from "cors";
import express, { json } from "express";

import routerPosts from "./routes/posts.routes.js";
import routerUsers from "./routes/user.routes.js";

import { logger } from "./middlewares/loggers.js";

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://literate-goggles-w4qjgg4p69539qrj-3000.app.github.dev",
            "https://smartclass-sandy.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(json());
app.use(logger);
app.use(routerPosts);
app.use(routerUsers);

export { app };
