import express from "express";
import { logIn, signUp } from "../controllers/AuthController/loginController.js";
const router = express.Router();

router.post("/sign_up",signUp);
router.post("/log_in",logIn);

export default router;