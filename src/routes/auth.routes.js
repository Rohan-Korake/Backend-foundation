import { Router } from "express";
import {
  changeCurrentPassword,
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resetForgotPassword,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  userChangeCurrentPassword,
  userForgotPasswordvalidator,
  userLoginValidator,
  userRegisterValidator,
  userResetForgotPassword,
} from "../validators/auth.validator.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// UNSECURED ROUTES

// validate and assign the register route
router.route("/register").post(userRegisterValidator(), validate, registerUser);

// validate and assign the login route
router.route("/login").post(userLoginValidator(), validate, loginUser);

// Assign the verify email route
router.route("/verify-email/:verificationToken").get(verifyEmail);

// Assign the refresh Access Token route
router.route("/refresh-token").post(refreshAccessToken);

// validate and assign the forgot password route
router
  .route("/forgot-password")
  .post(userForgotPasswordvalidator(), validate, forgotPassword);

// validate and assign the reset forgot password route
router
  .route("/reset-password/:resetToken")
  .post(userResetForgotPassword(), validate, resetForgotPassword);

// SECURED ROUTES

//  validate JWT and assign the logout route
router.route("/logout").post(verifyJWT, logoutUser);

// validate JWT and assign the current user route
router.route("/current-user").post(verifyJWT, getCurrentUser);

//  validate JWT, middleware and assign the change password route
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPassword(),
    validate,
    changeCurrentPassword,
  );

//  validate JWT and assign the resend email verification route
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

export default router;
