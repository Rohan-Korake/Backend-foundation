import { body } from "express-validator";

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

export { userRegisterValidator };
