import { Router } from "express";
import { registerUser } from "../controllers/auth.controllers.js";

const router = Router();
router.route("/").post(registerUser);
export default router;
