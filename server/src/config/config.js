require("dotenv").config();


module.exports = {
  SERVER_PORT: process.env.PORT,
  DB_USERNAME: process.env.MONGO_DB_USERNAME,
  DB_PASS: process.env.MONGO_DB_PASS,
  DB_URI: process.env.MONGO_DB_URI,
  API_KEY: process.env.API_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};
