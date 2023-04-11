const express = require("express");
const app = express();
const {User, Vite}= require("./db")
const cors = require("cors")
require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));


