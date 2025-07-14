const bcrypt = require("bcrypt");
const UserModel = require("../models/usermodel");
const sendVerifyEmail = require("../utils/sendVerifyEmail");



// verifyEmail funksiyası nə edir?
// 1. Gələn userId ilə istifadəçini tapır.
// 2. Əgər istifadəçi tapılmazsa, xəta atır.
// 3. Əgər istifadəçi tapılarsa, emailVerified sahəsini true edir.
// 4. İstifadəçini yeniləyir və true qaytarır.
// 5. Bu funksiya, istifadəçinin emailini təsdiqləmək üçün istifadə olunur.

const verifyEmail = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("İstifadəçi tapılmadı!");
  }

  user.emailVerified = true;
  await user.save();
  return true;
};



// Register

// register funksiyası nə edir?
// 1. Gələn userData ilə istifadəçini qeydiyyatdan keçirir.
// 2. Əgər email və password göndərilməyibsə, xəta atır.
// 3. Əgər email artıq mövcuddursa, xəta atır.
// 4. Parolu hash edir və yeni istifadəçi yaradır.
// 5. Yeni istifadəçini qaytarır.
// 6. Bu funksiya, istifadəçi qeydiyyatı üçün istifadə olunur.

const register = async (userData) => {

     if (!userData.email || !userData.password) {
    throw new Error("Email və şifrə mütləqdir!");
  }

  
  const duplicateUser = await UserModel.findOne({
    email: userData.email.toLowerCase(),
  });
  if (duplicateUser) {
    throw new Error("email is already taken!");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);


  const user = new UserModel({
    ...userData,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
 
  });

  const newUser = await user.save();


  return newUser;
};




// Login
// loginUser funksiyası nə edir?
// 1. Gələn identifier və password ilə istifadəçini daxil edir.
// 2. Əgər identifier və ya password göndərilməyibsə, xəta atır.
// 3. Email ilə istifadəçini tapır.
// 4. Əgər istifadəçi tapılmazsa, xəta atır.
// 5. Şifrəni yoxlayır.
// 6. Əgər şifrə düzgün deyilsə, xəta atır.
// 7. Əgər istifadəçi emailVerified deyilsə, xəta atır və təsdiq emaili göndərir.



const loginUser = async ({ identifier, password }) => {
  console.log("Login funksiyası başladı");

  if (!identifier || !password) {
    throw new Error("Email və şifrə göndərilməlidir");
  }

  const user = await UserModel.findOne({
    email: identifier.toLowerCase(),
  });

  console.log("Tapılan user:", user);

  if (!user) {
    console.log("İstifadəçi tapılmadı");
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    password.toString(),
    user.password
  );
  console.log("Şifrə yoxlaması:", isPasswordValid);

  if (!isPasswordValid) {
    console.log("Şifrə yalnışdır");
    throw new Error("Invalid credentials");
  }

  if (!user.emailVerified) {
    console.log("Email təsdiqlənməyib");
    await sendVerifyEmail({
      fullName: user.fullName,
      email: user.email,
      userId: user._id,
    });
    throw new Error("Email təsdiqlənməyib. Təsdiq linki yenidən göndərildi.");
  }

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

module.exports = {
  register,
  loginUser,
  verifyEmail,
};

// const bcrypt = require("bcrypt");
// const UserModel = require("../models/usermodel");

// const getAllClient = async () =>
//   await UserModel.find({ role: "client" }).select("-password");

// const getAllAdmin = async () =>
//   await UserModel.find({ role: "admin" }).select("-password");

// const getClientById = async (id) =>
//   await UserModel.findOne({ _id: id, role: "client" }).select("-password");

// const getAdminById = async (id) =>
//   await UserModel.findOne({ _id: id, role: "admin" }).select("-password");

// const verifyEmail = async (userId) => {
//   return UserModel.findByIdAndUpdate(
//     userId,
//     { emailVerified: true },
//     { new: true }
//   );
// };

// const updateUserById = async (id, updateData) => {
//    if (updateData.password) {
//         const saltRounds = 10;
//         updateData.password = await bcrypt.hash(updateData.password, saltRounds);
//     }
//     return UserModel.findByIdAndUpdate(id, updateData, { new: true }).select(
//         "-password"
//     );
// };

// // register funksiyasi ne edir?
// // burda bycript ile password hashlenir ve user yaradilir.
// // 1. UserModel.findOne ile email ve fullName kontrol edilir.
// // 2. Eger email ve fullName varsa, error atilir.
// // 3. Eger yoxdursa, password hashlenir.
// // 4. Yeni user yaradilir ve save edilir.
// // 5. Yeni user geri qaytarilir.
// // 6. Eger email ve fullName yoxdursa, user yaradilir ve save edilir.
// // 7. Yeni user geri qaytarilir.

// const register = async (userData) => {
//   const duplicateUser = await UserModel.findOne({
//     email: userData.email.toLowerCase(),
//   });
//   if (duplicateUser) {
//     throw new Error("email is already taken!");
//   } else {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

//     const user = new UserModel({
//       ...userData, //userData obyektini yaymaq
//       password: hashedPassword, //parolu hashlemek yeni user yaradarkən
//     });
//     return user.save();
//   }
// };

// // loginUser funksiyası nə edir?
// // 1. UserModel.findOne ilə email axtarılır.
// // 2. Əgər istifadəçi tapılmazsa, error atılır.
// // 3. Əgər istifadəçi tapılarsa, emailVerified yoxlanılır.
// // 4. Əgər emailVerified false-dursa, error atılır.
// // 5. Şifrə yoxlanılır.
// // 6. Əgər şifrə düzgün deyilsə, error atılır.
// // 7. Əgər şifrə düzgündürsə, istifadəçi obyektindən şifrə silinir və geri qaytarılır.

// const loginUser = async ({ identifier, password }) => {
//   const user = await UserModel.findOne({
//     email: identifier.toLowerCase(),
//   });

//   if (!user) {
//     throw new Error("Invalid credentials");
//   }

//   if (!user.emailVerified) {
//     throw new Error("email should be verified first!");
//   }

//   // 🔐 Sadəcə şifrə yoxlanışı
//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     throw new Error("Invalid credentials");
//   }

//   const userObject = user.toObject();
//   delete userObject.password;

//   return userObject;
// };

// // getUserByEmail funksiyası email ilə istifadəçi tapır.
// // 1. UserModel.findOne ilə email axtarılır.
// // 2. Əgər istifadəçi tapılmazsa, error atılır.
// // 3. Əgər tapılarsa, istifadəçi geri qaytarılır.

// const getUserByEmail = async (email) => {
//   const user = await UserModel.findOne({ email: email });

//   console.log("user: ", user);
//   if (!user) throw new Error("this email does not exist!");
//   return user;
// };

// const resetPass = async (email, newPassword) => {
//   const account = await UserModel.findOne({ email: email });
//   console.log("account: ", account);
//   console.log("new password: ", newPassword);
//   if (!account) throw new Error("account was not found!");
//   const newHashedPassword = await bcrypt.hash(newPassword, 10);
//   account.password = newHashedPassword;
//   await account.save();

//   const accountObj = account.toObject();
//   delete accountObj.password; // password sahəsini silirik

//   return accountObj; // password olmadan qaytarırıq

// };

// module.exports = {
//   getAllClient,
//   getAllAdmin,
//   getAdminById,
//   getClientById,
//   verifyEmail,
//   updateUserById,
//   register,
//   loginUser,
//   getUserByEmail,
//   resetPass,
// };
