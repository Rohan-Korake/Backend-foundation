import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// create user schema
const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://placehold.co/100x100`,
        localPath: "",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmialVerified: {
      type: Boolean,
      default: false,
    },
    refreashToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpir: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Create pre mongoDB hook
userSchema.pre("save", async function (next) {
  // if the password feild is not updated
  if (!this.isModified("password")) return next();

  // Hash the user password with 10 round and then store in DB
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// check the password is correct or not using bcrypt compare
userSchema.methods.isPasswordCorrect(async function (password) {
  return await bcrypt.compare(this.password, password);
});

// Generate Access Token using methods
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

// Generate Refresh Token using methods
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    },
  );
};

// Generate Temporary Token using methods
userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000; //20 min

  return {
    unHashedToken,
    hashedToken,
    tokenExpiry,
  };
};

// Create and export User model from userSchema
export const user = mongoose.model("User", userSchema);
