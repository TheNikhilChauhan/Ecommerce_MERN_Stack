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

  await user.save();
  const token = user.getJwtToken();
  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "User created successfully",
    user,
  });
});

/*****************
 * @Login
 * @route http://localhost:8080/api/v1/auth/login
 * @returns User Object
 */

export const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(`Please fill all fields`, 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(`Invalid credentials`, 400);
    }

    if (!user || !user.comparePassword(password)) {
      return next(new ApiError("Email or password does not match!", 400));
    }

    const token = await user.getJwtToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "User logged in Successfully",
      token,
      user,
    });
  } catch (error) {
    return next(new ApiError("Invalid credentials", 400));
  }
});

/******************************************************
 * @LOGOUT
 * @route http://localhost:8080/api/v1/auth/logout
 * @returns success message
 ******************************************************/
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

/******************************************************
 * @GET_PROFILE
 * @route http://localhost:8080/api/v1/auth/profile
 * @returns User Object
 ******************************************************/

export const getProfile = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new ApiError("User not found", 400));
  }
  res.status(200).json({
    success: true,
    message: "User Details",
    user,
  });
});
