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
    body("password")
      .trim()
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 6, max: 10 })
      .withMessage("Password length must be between the 6 to 10"),
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
    body("password")
      .trim()
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 6, max: 10 })
      .withMessage("Password length must be between the 6 to 10"),
  ];
};

export { userRegisterValidator, userLoginValidator };
