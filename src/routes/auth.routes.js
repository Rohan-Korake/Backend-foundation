import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validators/auth.validator.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// validate and assign the register route
router.route("/register").post(userRegisterValidator(), validate, registerUser);

//  validate and assign the login route
router.route("/login").post(userLoginValidator(), validate, loginUser);

//  validate and assign the logout route
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
