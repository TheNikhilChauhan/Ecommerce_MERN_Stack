import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import errorMiddleware from "./middleware/error.middleware.js";
import userRoutes from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);

app.use(errorMiddleware);

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "backend/config/.env",
  });
}

export default app;
