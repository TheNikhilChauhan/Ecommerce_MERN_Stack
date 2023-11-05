import { Router } from "express";
import upload from "../multer.js";
import { createUser } from "../controller/user.controller.js";

const router = Router();

router.post("/create-user", upload.single("file"), createUser);

export default router;
