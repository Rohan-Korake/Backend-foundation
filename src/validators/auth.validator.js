import { body, query } from "express-validator";
import { availableRole } from "../utils/constants.js";

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

// validate the create project data
const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

// validate the add project memeber data
const addMemberToProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(availableRole)
      .withMessage("Invalid role"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPassword,
  userForgotPasswordvalidator,
  userResetForgotPassword,
  createProjectValidator,
  addMemberToProjectValidator,
};
