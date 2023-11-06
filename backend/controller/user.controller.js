import User from "../model/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import sendMail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userEmail = await User.findOne({ email });

    //if any field is empty
    if (!name || !email || !password) {
      return next(new ErrorHandler("All fileds are required", 400));
    }

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

    //file upload
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "ecomm",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          //Remove file from local system or server: saving on cloudinary
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next(
          new ErrorHandler(error || "File not uploaded, please try again", 400)
        );
      }
    }
    console.log(user);

    /*   //create activation token
    const createActivationToken = (user) => {
      return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
      });
    };

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;
 */
    /*  try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    } */

    //activate user
    // const activateUser = async (req, res, next) => {
    //   try {
    //     const { activation_token } = req.body;

    //     const newUser = jwt.verify(
    //       activation_token,
    //       process.env.ACTIVATION_SECRET
    //     );

    //     if (!newUser) {
    //       return next(new ErrorHandler("Invalid Token", 400));
    //     }
    //     const { name, email, password, avatar } = newUser;
    //   } catch (error) {
    //     return next(new ErrorHandler(error.message, 500));
    //   }
    // };

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export { createUser };
