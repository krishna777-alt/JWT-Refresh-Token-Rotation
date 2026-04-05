import express from "express";
import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refreshToken", refresh);
router.post("/logout", logout);
