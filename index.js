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
//authorization middleware
const setUser = (async (req, res, next)=>{
    const auth = req.header('Authorization')
    if(!auth){
      next()
    }else{
      const [, token] = auth.split(" ");
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      next();
    }
  })

  //POST REGISTER
  app.post("/register", async(req,res,next)=>{
    try{
        const {username, password}= req.body;
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({username,password:hash})
        const token = jwt.sign({username, id:user.id}, JWT_SECRET)
        res.send({message:"newbee registered", token: token})
    }catch(error){
        next(error)
    }
       
  })

  //Post login
  app.post('/login', async(req,res,next)=>{
      try{
          const {username, password} = req.body
          const foundUser = await User.findOne({where:{username}})
          if(!foundUser){
              res.send(401)
          }else{
              const isMatch = await bcrypt.compare(password, foundUser.password)
              if (!isMatch){
                  res.sendStatus(401)
              }else{
                const token= jwt.sign(username, JWT_SECRET)
          res.send({message: 'Welcome to new bee', token: token})
              }
            }
            }catch(error){
      next(error)
    }
  })
// get all vites once logged in
  app.get('/vites', setUser, async(req,res, next)=>{
   
        if(req.user){
            const vitesLogin = await Vite.findAll( req.user);
            res.status(200).json(vitesLogin)
        }else{
            res.sendStatus(401)
        }
  })
// get vite by id(once logged in)
// create vite (once logged in )
app.post('/vites', setUser, async (req, res, next)=>{
    try{
        if(!req.user){
            res.send(401)
        }else{
            const {place, name, description} = req.body
            const vite = await Vite.create({userId: req.user.id, place,name, description})
            res.sendStatus(201)({place: vite.place, name: vite.name, description: vite.description})
        }
    }catch(error){
        next(error)
    }
})
// update vite (once logged in)
// delete vite (once logged in)
app.delete('/vites/:id', setUser, async(req, res, next)=>{
    try{
        const vite = await Vite.findByPk(req.params.id)
        if(!req.user){
            res.sendStatus(401)
        }else if(req.user.id !== vite.userId){
            res.sendStatus(401)
        }else{
            await vite.destroy()
            res.sendStatus(204)
        }
    }catch(error){
        next(error)
    }
})



app.listen(PORT, () =>{
    sequelize.sync({force: false})
    console.log(`Newbee connection ready at http://localhost:${PORT}`);
});