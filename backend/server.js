import app from "./app.js";
import { configDotenv } from "dotenv";
import dbConnect from "./db/Database.js";

//handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server for handling uncaugh exception`);
});

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  configDotenv({
    path: "backend/config/.env",
  });
}

//connect db
dbConnect();

//create server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`Shutting down the server for unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
