import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  signUp,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(signUp);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/getProfile").get(getProfile);

export default router;
