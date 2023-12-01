import express from "express";
import userRoutes from "./routes/user.route.js";

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", userRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to my app",
  });
});

export { app };
