const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
    emailVerified: { type: Boolean, default: false },


    authType: {
      type: String,
      enum: ["google", "local"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = userSchema;
