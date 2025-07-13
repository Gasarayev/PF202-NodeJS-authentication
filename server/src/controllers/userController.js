const bcrypt = require("bcrypt");
const UserModel = require("../models/usermodel");
const formatMongoData = require("../utils/formatMongoData");
const { register, loginUser, verifyEmail } = require("../services/userService");

// POST /api/register
const registerUserController = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await register(userData);

    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      data: formatMongoData(userObj),
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
    const { id } = req.params;
    await verifyEmail(id);

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
