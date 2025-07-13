const UserModel = require("../models/usermodel");
const formatMongoData = require("../utils/formatMongoData");
const { register, loginUser, verifyEmail } = require("../services/userService");
const sendVerifyEmail = require("../utils/sendVerifyEmail");
const { generateJWTtoken, verifyJWTtoken } = require("../utils/jwt");
const { SERVER_URL } = require("../config/config");

// POST /api/register
const registerUserController = async (req, res, next) => {
    console.log("Gələn req.body (register):", req.body);

  try {
    const userData = req.body;
    const registeredUser = await register(userData);
    console.log("Gələn req.body (register):", req.body);


    const token = generateJWTtoken({
      id: registeredUser._id,
      email: registeredUser.email,
      fullName: registeredUser.fullName,
    });

    await sendVerifyEmail({
      fullName: req.body.fullName,
      email: req.body.email,
      verifyLink: `${SERVER_URL}/auth/verify-email/${token}`,
    });

    res.status(201).json({
      message: "user registered successfully, verify your email!",
      data: formatMongoData(registeredUser),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/login
const loginUserController = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    console.log("REQ BODY (login):", req.body);
    const user = await loginUser({ identifier, password });

    res.status(200).json({
      success: true,
      data: formatMongoData(user),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/profile
const getProfileController = async (req, res, next) => {
  try {
    const users = await UserModel.find().select("-password");

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      data: formatMongoData(users),
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmailController = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = verifyJWTtoken(token);

    console.log("Decoded token:", decoded.payload);
    await verifyEmail(decoded.payload.id);

    // res.redirect(`${CLIENT_URL}/email-verified?status=success`);

    res.status(200).json({
      success: true,
      message: "Email uğurla təsdiqləndi!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  getProfileController,
  verifyEmailController,
};
