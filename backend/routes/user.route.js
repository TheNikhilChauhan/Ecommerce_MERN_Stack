import { Router } from "express";
import { signUp } from "../controller/user.controller.js";

const router = Router();

router.post("/sign-up", signUp);

export default router;
