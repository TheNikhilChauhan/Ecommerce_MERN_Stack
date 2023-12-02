import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

/***********************
 * @SignUp
 * @route http://localhost:8080/api/v1/auth/signUp
 * @return User Object
 */
export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

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

  const token = user.getJwtToken();
  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "User created successfully",
    user,
  });
});
