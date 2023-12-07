import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your email!"],
      maxLength: [50, "Name must be less than 50"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

// encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  //compare password
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  //generate JWT Token
  getJwtToken: function () {
    return JWT.sign(
      {
        _id: this._id,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },

  //generate forgot password
  generateForgotPasswordToken: function () {
    const forgotToken = crypto.randomBytes(32).toString("hex");

    //save to db
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");

    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
    //return values to user

    return forgotToken;
  },
};

export const User = mongoose.model("User", userSchema);
