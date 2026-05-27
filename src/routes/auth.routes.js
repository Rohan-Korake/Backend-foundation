import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validators/auth.validator.js";

const router = Router();

// validate and assign the register route
router.route("/register").post(userRegisterValidator(), validate, registerUser);

// assign the login route
router.route("/login").post(userLoginValidator(), validate, loginUser);

export default router;
