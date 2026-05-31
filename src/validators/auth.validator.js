import { body } from "express-validator";

// validate the user registration data
const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username").trim().notEmpty().withMessage("username is required"),
    body("password").trim().notEmpty().withMessage("password is required"),
  ];
};

// validate the user login data
const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password").trim().notEmpty().withMessage("password is required"),
  ];
};

// validate the user changed new password
const userChangeCurrentPassword = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old Password is required"),
    body("newPassword").notEmpty().withMessage("New Password is required"),
  ];
};

// validate the user forgot password
const userForgotPasswordvalidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

// validate the user reset forgot password
const userResetForgotPassword = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPassword,
  userForgotPasswordvalidator,
  userResetForgotPassword,
};
