const express = require("express");
const router = express.Router();

const {
  registerUserController,
  loginUserController,
  getProfileController,
  verifyEmailController,
} = require("../controllers/userController");


router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/profile", getProfileController);  
router.get("/verify-email/:token", verifyEmailController);


module.exports = router;