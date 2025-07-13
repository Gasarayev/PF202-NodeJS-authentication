const express = require('express');
const app = express();
require("dotenv").config();

// global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



module.exports = app;