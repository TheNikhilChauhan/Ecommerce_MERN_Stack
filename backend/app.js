import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/routes.js";
import cors from "cors";

const app = express();

import ErrorHandler from "./utils/ErrorHandler.js";

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/", express.static("uploads"));

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  configDotenv({
    path: "backend/config/.env",
  });
}

//import middleware
app.use("/api/v2/user", userRoutes);

// it's for ErrorHandling
app.use(ErrorHandler);

export default app;
