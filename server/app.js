const express = require('express');
const app = express();
require("dotenv").config();
const userRoutes = require("./src/routes/userRoutes");


// global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/auth", userRoutes);


module.exports = app;