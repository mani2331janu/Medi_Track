import express from "express";
import { signUp } from "../controllers/AuthController/loginController.js";
const router = express.Router();

router.post("/sign_up",signUp);

export default router;