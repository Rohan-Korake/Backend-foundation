import { User } from "../models/user.models.js";
import { ProjectMember } from "../models/projectmember.modles.js";
import { apiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { apiResponse } from "../utils/api-response.js";
import mongoose from "mongoose";

// Verifies whether the JWT token is valid, original, and created using the correct secret key.
// Middleware to verify user JWT token
export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Get token from cookies OR Authorization header

  const token =
    req.cookies?.accessToken ||
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

export const validateProjectPermission = (roles = []) =>
  asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId) {
      return res
        .status(400)
        .json(new apiResponse(400, {}, "Project Id is missing"));
    }

    // Find project membership
    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    // Check if user belongs to project
    if (!project) {
      return res
        .status(404)
        .json(new apiResponse(404, {}, "Project not found"));
    }

    const givenRole = project.role;

    // Attach role to request
    req.user.role = givenRole;

    // Check permission
    if (!roles.includes(givenRole)) {
      return res
        .status(403)
        .json(
          new apiResponse(
            403,
            {},
            "You do not have permission to perform this action",
          ),
        );
    }

    next();
  });
