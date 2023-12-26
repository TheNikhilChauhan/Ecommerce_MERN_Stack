import asyncHandler from "../middleware/asyncHandler.middleware.js";
import User from "../model/user.schema.js";
import ErrorHandler from "../utils/ErrorHandler.utils.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

//cookie options
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  httpOnly: true,
  secure: true,
};

/********************************************
 * @SIGNUP
 * @route http://localhost:8080/api/auth/signup
 * @description User signUp Controller for creating new user
 * @parameters name, email, password
 * @returns User Object
 *******************************************/
//todo : add multer in middleware
export const signUp = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new CustomError("Please fill all fields", 400);
    }

    //check if user exists
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url: email,
      },
    });

    if (!user) {
      return next(
        new ErrorHandler("User registration failed, please try again", 400)
      );
    }

    //todo: file upload
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "ecommerce",
          width: 12,
          height: 12,
          gravity: "faces",
          crop: "fill",
        });
        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          fs.rm(`upload/${req.file.filename}`);
        }
      } catch (error) {
        return next(
          new ErrorHandler(error || "File not uploaded, please try again", 400)
        );
      }
    }

    await user.save();

    const token = await user.getJwtToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
