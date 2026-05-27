import { User } from "../models/user.models.js";
import { apiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

// Verifies whether the JWT token is valid, original, and created using the correct secret key.
// Middleware to verify user JWT token
export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Get token from cookies OR Authorization header
  const token =
    req.cookie?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  // throw error when token is not found
  if (!token) {
    throw new apiError(401, "Unauthorized Request");
  }

  // Verify token using secret key
  try {
    // Checks if token is real or fake
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user in database using ID from token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry", //Remove sensitive fields.
    );

    // If user does not exist in database
    if (!user) {
      throw new apiError(401, "Invalid Access Token");
    }

    // Store user data inside request
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, "Invalid Access Token");
  }
});
