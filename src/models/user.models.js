import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { use } from "react";

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

// create pre mongoDB hook
userSchema.pre("save", async function (next) {
  // if the password feild is not updated
  if (!this.isModified("password")) return next();

  //   hash the user password with 10 round and then store in DB
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// check the password is correct or not using bcrypt compare
userSchema.methods.isPasswordCorrect(async function (password) {
  return await bcrypt.compare(this.password, password);
});
