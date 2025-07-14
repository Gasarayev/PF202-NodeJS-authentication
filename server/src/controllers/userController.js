const UserModel = require("../models/usermodel");
const formatMongoData = require("../utils/formatMongoData");
const { register, loginUser, verifyEmail } = require("../services/userService");
const sendVerifyEmail = require("../utils/sendVerifyEmail");
const { generateJWTtoken, verifyJWTtoken } = require("../utils/jwt");
const { SERVER_URL } = require("../config/config");

// POST /api/register
// 1. Gələn req.body məlumatını konsola yazdırır.
// 2. register funksiyasını çağıraraq istifadəçini qeydiyyatdan keçirir
// 3. İstifadəçi uğurla qeydiyyatdan keçdikdən sonra JWT token yaradır.
// 4. sendVerifyEmail funksiyasını çağıraraq istifadəçiyə təsdiq emaili göndərir.
// 5. Uğurlu qeydiyyat mesajı ilə istifadəçiyə cavab qaytarır.
// 6. Əgər hər hansı bir xəta baş verərsə, onu növbəti middleware-ə ötürür.

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
// loginUserController funksiyası nə edir?
// 1. Gələn req.body məlumatını konsola yazdırır.
// 2. loginUser funksiyasını çağıraraq istifadəçini daxil edir.
// 3. Əgər istifadəçi uğurla daxil olarsa, istifadəçi məlumatlarını
//    formatMongoData funksiyası ilə formatlayır və istifadəçiyə göndərir.
// 4. Əgər hər hansı bir xəta baş verərsə, onu növbəti middleware-ə ötürür.

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
// getProfileController funksiyası nə edir? setir setir?
// 1. Gələn istifadəçi məlumatlarını əldə edir.
// 2. Əgər istifadəçi tapılmazsa, 404 status kodu ilə cavab qaytarır.
// 3. Əgər istifadəçi tapılarsa, istifadəçi məlumatlarını formatlayır və göndərir.
// 4. Əgər hər hansı bir xəta baş verərsə, onu növbəti middleware-ə ötürür.
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

// verifyEmailController funksiyası nə edir? setir setir?
// 1. Gələn tokeni yoxlayır və deşifrə edir.
// 2. Əgər token etibarsızdırsa, xəta atır.
// 3. Əgər token etibarlıdırsa, istifadəçinin emailini təsdiqləyir.
// 4. Uğurlu təsdiq mesajı ilə istifadəçiyə cavab qaytarır.
// 5. Əgər hər hansı bir xəta baş verərsə, onu növbəti middleware-ə ötürür.
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
