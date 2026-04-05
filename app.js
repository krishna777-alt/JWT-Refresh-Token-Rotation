import express from "express";
import cookieParser from "cookie-parser";

import route from "./src/routes/authRoute.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", route);

export default app;
