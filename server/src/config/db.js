const mongoose = require("mongoose");
const { DB_PASS, DB_URI, DB_USERNAME } = require("./config");


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      DB_URI.replace("<db_password>", DB_PASS),
      {
        dbName: DB_USERNAME,

      }
    );

    console.log(`MongoDB Connected 💪 `);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    process.exit(1);
  }
};

module.exports = connectDB;
