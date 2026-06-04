import { User } from "../models/user.models.js";
import { apiError } from "../utils/api-error.js";
import { apiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  emailVerificationMailContent,
  forgotPasswordMailContent,
  sendEmail,
} from "../utils/mail.js";
import Mailgen from "mailgen";
import jwt from "jsonwebtoken";
import { response } from "express";
import crypto from "crypto";
import { log } from "console";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId); //check is database
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating accesstoken",
    );
  }
};

// accept register user data
const registerUser = asyncHandler(async (req, res) => {
  // Extract user credentials from the request body
  const { email, username, password } = req.body;

  // Check if a user already exists with the same username OR email
  const existedUser = await User.findOne({ email });

  // send 409 resposne
  if (existedUser) {
    return res
      .status(409)
      .json(new apiResponse(409, {}, "Email is already exists"));
  }

  // create user
  const user = await User.create({
    email,
    username,
    password,
    isEmailVerified: false,
  });

  // Generate tokens
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  //   save the data in DB
  await user.save({ validateBeforeSave: false });

  //   send email to user
  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailGenContent: emailVerificationMailContent(
      user.username,
      `${process.env.VERIFY_EMAIL_URL}?token=${unHashedToken}&email=${user.email}`,
    ),
  });

  // Fetch user profile and exclude all sensitive authentication fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  //   handle error
  if (!createdUser) {
    return res
      .status(500)
      .json(new apiResponse(500, {}, "Something went wrong"));
  }

  //   respose back to request
  return res.status(200).json(
    new apiResponse(200, {
      user: createdUser,
      message: "User registered successfully. Verification email sent.",
    }),
  );
});

// accpet login user data
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check field are empty
  if (!email) {
    return res.status(400).json(new apiResponse(400, {}, "Email is required"));
  }

  // check user is exists or not
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "User does not exists"));
  }

  // check password is correct or not
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json(new apiResponse(401, {}, "Invalid credentails"));
  }

  // check email is verified or not before login and resend email
  const emailVerified = await user.isEmailVerified;
  if (!emailVerified) {
    // Generate tokens
    const { unHashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    //   save the data in DB
    await user.save({ validateBeforeSave: false });

    //   send email to user
    await sendEmail({
      email: user.email,
      subject: "Please verify your email",
      mailGenContent: emailVerificationMailContent(
        user.username,
        `${process.env.VERIFY_EMAIL_URL}?token=${unHashedToken}&email=${user.email}`,
      ),
    });

    return res
      .status(403)
      .json(new apiResponse(403, {}, "Please Verify email"));
  }

  // once the credentails are valid generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  // Fetch user profile and exclude all sensitive authentication fields
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  // now respond back to user and set cookie
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
        },
        "User logged in successfully",
      ),
    );
});

// logout the user and clear the cookie and tokens
const logoutUser = asyncHandler(async (req, res) => {
  // prevent the crash
  if (!req.user || !req.user._id) {
    return res
      .status(401)
      .json(new apiResponse(401, {}, "Unauthorized: No active session found"));
  }

  // find the database enrty and update this
  await User.findByIdAndUpdate(
    req.user._id,
    {
      // to change any field set is used
      $set: {
        refreshToken: "", // Clear token in DB
      },
    },
    {
      // This tells to give most updated object
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  // respond back to user and clear the cookie
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out"));
});

// get the current user data
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, res.user, "Current user fetched successfully"));
});

// send email verification
const verifyEmail = asyncHandler(async (req, res) => {
  // Extract the verification token from the URL path parameters
  const { verificationToken } = req.body;

  // Send error response if the token is not present in url path
  if (!verificationToken) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "Verification link is invalid."));
  }

  // Hash the incoming plain-text token
  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // find the user using hash value and check the verification is valid or not
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  // if the token is expired
  if (!user) {
    return res
      .status(401)
      .json(new apiResponse(400, {}, "Oops! This link has expired."));
  }

  // Mark that email is verified
  user.isEmailVerified = true;

  // save the changes in database
  await user.save({ validateBeforeSave: false });

  // Send back a success response to the frontend
  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { isEmailVerified: true },
        "Email Verified Successfully!",
      ),
    );
});

// resend the email verification
const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // check the data present or not
  if (!email) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "Invalid request data. Missing email."));
  }

  // Find the user by email
  const user = await User.findOne({ email });

  // send error response if the user in not exists
  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, {}, "User does not exist"));
  }

  // handle response if user is already verified email
  if (user.isEmailVerified) {
    return res
      .status(409)
      .json(new apiResponse(409, {}, "Email is already verified"));
  }

  // Generate NEW tokens (don't need to validate old token)
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  // Update fields with NEW token
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  //   save the data in DB
  await user.save({ validateBeforeSave: false });

  //   send email to user with NEW token
  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailGenContent: emailVerificationMailContent(
      user.username,
      `${process.env.VERIFY_EMAIL_URL}?token=${unHashedToken}&email=${user.email}`,
    ),
  });

  // respond back to user with 200 status
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Email verification sent successfully"));
});

// Refresh access and refresh tokens using a valid incoming refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Extract the refresh token from cookies or request body
  const incomingRefreshToken =
    req.cookies.refreshAccessToken || req.body.refreshToken;

  // Send error response if token is not found
  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized access");
  }

  try {
    // verify that incomingRefreshToken and REFRESH_TOKEN_SECRET is same or not
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    // Fetch user from database and verify existence
    const user = await User.findById(decodedToken?._id);

    // if user not found in database send a error
    if (!user) {
      throw new apiError(401, "Invalid Refresh Token");
    }

    // Check the incomingRefreshToken with database refreshToken
    if (incomingRefreshToken != user.refreshToken) {
      throw new apiError(401, "Refresh Token is Expired");
    }

    const options = {
      httpOnly: true, //indicate these are secure cookies
      secure: true, //only browser can manipulate
    };

    // generate Access And Refresh Token
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    // update token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // response back to request
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new apiResponse(200, {}, "Access Token refresh"));
  } catch (error) {
    throw new apiError(401, "Invalid Refresh Token");
  }
});

// handle forgot password request
const forgotPassword = asyncHandler(async (req, res) => {
  // access the email from frontend
  const { email } = req.body;

  // find the used in database
  const user = await User.findOne({ email });

  // Send status 403 if user not found
  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, {}, "User does not exists "));
  }

  // Generate tokens
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  // update token in database
  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  //   send email to user
  await sendEmail({
    email: user.email,
    subject: "Password Reset request",
    mailGenContent: forgotPasswordMailContent(
      user.username,
      `${process.env.FORGOT_PASSWORD_REDIRECT_URL}?token=${unHashedToken}`,
    ),
  });

  // respond back to frontend
  return res
    .status(200)
    .json(
      new apiResponse(200, {}, "Password reset mail has been send on email "),
    );
});

// reset the forgot password
const resetForgotPassword = asyncHandler(async (req, res) => {
  // get the data
  const { token, newPassword } = req.body;

  if (!token) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "Reset token is required"));
  }

  if (!newPassword) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "New password is required"));
  }

  // create a hash token
  let hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // find the user in database
  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  // handle the error if user is not found
  if (!user) {
    return res
      .status(401)
      .json(new apiResponse(401, {}, "Token is invalid or expired"));
  }

  // set a new password
  user.password = newPassword;
  // update the database data fields
  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;
  // Mark fields as modified so Mongoose saves them

  await user.save({ validateBeforeSave: false });

  // response back to user
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password reset successfully"));
});

// change the currect password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  // get the old and new password
  const { oldPassword, newPassword } = req.body;

  // find the user in database
  const user = await User.findById(req.user?._id);

  // handle the error if user is not found
  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, {}, "User does not exists"));
  }

  // Verify if the old password matches the database
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  // if the password is not match to old database password throw error
  if (!isPasswordValid) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "Incorrect old password"));
  }

  // update and save the password in database
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  // respond back to frontend
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPassword,
  resetForgotPassword,
  changeCurrentPassword,
};
