import { validationResult } from "express-validator";
import { apiError } from "../utils/api-error.js";
import { response } from "express";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  //   if no error just move on
  if (errors.isEmpty()) {
    return next();
  }

  //   Extract the error so user can easy understand
  const extractedErrors = [];
  errors.array().map((err) => {
    extractedErrors.push({ [err.path]: err.msg });
  });

  //  error response tp API request
  throw new apiError(402, "Recieved data in invalid", extractedErrors);
};
