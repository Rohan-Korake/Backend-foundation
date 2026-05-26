import { User } from "../models/user.models.js";
import { apiError } from "../utils/api-error.js";
import { apiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailContent, sendEmail } from "../utils/mail.js";
import Mailgen from "mailgen";

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

const registerUser = asyncHandler(async (req, res) => {
  // Extract user credentials from the request body
  const { email, username, password } = req.body;

  // Check if a user already exists with the same username OR email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // send error resposne
  if (existedUser) {
    throw new apiError(409, "Email is already exists");
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

  user.emailVerificationToken = unHashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  //   save the data in DB
  await user.save({ validateBeforeSave: false });

  //   send email to user
  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailGenContent: emailVerificationMailContent(
      user.username,
      `${req.protocol}://${req.get("host")}/verify-email/${unHashedToken}`,
    ),
  });

  // Fetch user profile and exclude all sensitive authentication fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  //   handle error
  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  //   respose back to request
  return res.status(200).json(
    new apiResponse(200, {
      user: createdUser,
      message:
        "User registered successfully and verification email has sent on your email",
    }),
  );
});

export { registerUser };
