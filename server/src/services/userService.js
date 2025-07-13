const bcrypt = require("bcrypt");
const UserModel = require("../models/usermodel");

const getAllClient = async () =>
  await UserModel.find({ role: "client" }).select("-password");

const getAllAdmin = async () =>
  await UserModel.find({ role: "admin" }).select("-password");

const getClientById = async (id) =>
  await UserModel.findOne({ _id: id, role: "client" }).select("-password");

const getAdminById = async (id) =>
  await UserModel.findOne({ _id: id, role: "admin" }).select("-password");

const verifyEmail = async (userId) => {
  return UserModel.findByIdAndUpdate(
    userId,
    { emailVerified: true },
    { new: true }
  );
};

const updateUserById = async (id, updateData) => {
  return UserModel.findByIdAndUpdate(id, updateData, { new: true }).select(
    "-password"
  );
};

// register funksiyasi ne edir?
// burda bycript ile password hashlenir ve user yaradilir.
// 1. UserModel.findOne ile email ve fullName kontrol edilir.
// 2. Eger email ve fullName varsa, error atilir.
// 3. Eger yoxdursa, password hashlenir.
// 4. Yeni user yaradilir ve save edilir.
// 5. Yeni user geri qaytarilir.
// 6. Eger email ve fullName yoxdursa, user yaradilir ve save edilir.
// 7. Yeni user geri qaytarilir.

const register = async (userData) => {
  const duplicateUser = await UserModel.findOne({
    email: userData.email.toLowerCase(),
  });
  if (duplicateUser) {
    throw new Error("email is already taken!");
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const user = new UserModel({
      ...userData, //userData obyektini yaymaq
      password: hashedPassword, //parolu hashlemek yeni user yaradarkən
    });
    return user.save();
  }
};

const loginUser = async ({ identifier, password }) => {
  const user = await UserModel.findOne({
    email: identifier.toLowerCase(),
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.emailVerified) {
    throw new Error("email should be verified first!");
  }

  // 🔐 Sadəcə şifrə yoxlanışı
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

const getUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email: email });

  console.log("user: ", user);
  if (!user) throw new Error("this email does not exist!");
  return user;
};

const resetPass = async (email, newPassword) => {
  const account = await UserModel.findOne({ email: email });
  console.log("account: ", account);
  console.log("new password: ", newPassword);
  if (!account) throw new Error("account was not found!");
  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  account.password = newHashedPassword;
  await account.save();
  return account;
};

module.exports = {
  getAllClient,
  getAllAdmin,
  getAdminById,
  getClientById,
  verifyEmail,
  updateUserById,
  register,
  loginUser,
  getUserByEmail,
  resetPass,
};
