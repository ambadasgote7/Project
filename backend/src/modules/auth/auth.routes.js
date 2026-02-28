import express from "express";
import {
  login,
  setPassword,
  logout,
  getMe
} from "./auth.controller.js";

import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/set-password", setPassword);
router.post("/logout", logout);

router.get("/me", authenticate, getMe);

export default router;