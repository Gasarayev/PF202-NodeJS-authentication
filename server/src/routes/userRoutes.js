const express = require("express");
const router = express.Router();

const {
  registerUserController,
  loginUserController,
  getProfileController,
  verifyEmailController,
} = require("../controllers/userController");

// Auth routes (tokensiz versiya)
router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/profile", getProfileController);  
router.get("/verify-email/:id", verifyEmailController);


module.exports = router;