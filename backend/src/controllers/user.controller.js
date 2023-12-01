import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  if (!name || !password || !email) {
    throw new ApiError(`Please fill all the fields`, 400);
  }

  //check if user exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(`User already exists`, 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "User created successfully",
    user,
  });
});
