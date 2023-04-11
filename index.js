const express = require("express");
const app = express();
const cors = require("cors")
require("dotenv").config()
const{PORT,JWT_SECRET}= process.env
const bcrypt = require("bcrypt")
const SALT_COUNT = 10
const {User, sequelize}= require("./db")
const jwt = require("jsonwebtoken")