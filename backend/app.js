import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";

const app = express();

import fileUpload from "express-fileupload";
import ErrorHandler from "./utils/ErrorHandler.js";

app.use(express.json());
app.use(cookieParser());
app.use("/test", (req, res) => {
  res.send("Hello World");
});

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload({ useTempFiles: true }));

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  configDotenv({
    path: "backend/config/.env",
  });
}

// it's for ErrorHandling
app.use(ErrorHandler);

export default app;
