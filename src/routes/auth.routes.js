import { Router } from "express";
import { registerUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { userRegisterValidator } from "../validators/auth.validator.js";

const router = Router();

// validate and assign the register route
router.route("/").post(userRegisterValidator(), validate, registerUser);
export default router;
