import User from "../model/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import path from "path";

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  const userEmail = await User.findOne({ email });

  // Check if the required data is valid before making the request
  if (!avatar || !name || !email || !password) {
    console.log("Missing required data");
    return;
  }

  if (userEmail) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const filename = req.file.filename;
  const fileUrl = path.join(filename);

  const user = {
    name: name,
    email: email,
    password: password,
    avatar: fileUrl,
  };

  const newUser = await User.create(user);
  res.status(201).json({
    success: true,
    newUser,
  });
};

export { createUser };
