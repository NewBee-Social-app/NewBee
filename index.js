const express = require("express");
const app = express();
const {User, Vite, sequelize}= require("./db")
const cors = require("cors")
require("dotenv").config()
const {PORT,JWT_SECRET} = process.env
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const path =require('path')
//middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get('/', async (req,res,next)=>{
    try{
        res.sendFile(path.join(__dirname, 'index.html'));
    }catch(error){
        console.error(error)
        next(error)
    }
})


app.listen(PORT, () =>{
    // sequelize.sync({force: false})
    console.log(`Newbee connection ready at http://localhost:${PORT}`);
});