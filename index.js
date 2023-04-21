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
      console.log(payload)
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
              res.sendStatus(401)
          }else{
              const isMatch = await bcrypt.compare(password, foundUser.password)
              if (!isMatch){
                  res.sendStatus(401)
              }else{
                const token= jwt.sign({username, id:foundUser.id},JWT_SECRET)
          res.send({message: 'Welcome to new bee', token: token})
              }
            }
            }catch(error){
      next(error)
    }
  })
  //get all users
  app.get('/users',  async(req,res, next)=>{
        const usersall = await User.findAll(); 
        res.send(usersall)
    }
)
// get all vites once logged in
  app.get('/vites', setUser, async(req,res, next)=>{
   
        if(req.user){
            const vitesLogin = await Vite.findAll();
            console.log(req.user.id)
            const vitesUser = await User.findByPk(req.user.id);
            console.log(vitesUser)
            res.status(200).json(vitesLogin)
        }else{
            res.sendStatus(401)
        }
  })
// get vite by id(once logged in)
app.get('/vites/:id', setUser, async(req, res, next)=>{
    try{
        console.log(req.params.id)
        const vite = await Vite.findByPk(req.params.id)
        if(!req.user){
            res.sendStatus(401)
        }else if(req.user.id !== vite.userId){
            res.sendStatus(401) // use this only if you want to see the ones you created
        }else{
           res.send({place: vite.place, name: vite.name, description: vite.description})
        }
    }catch(error){
        next(error)
    }
})
// create vite (once logged in )
app.post('/vites', setUser, async (req, res, next)=>{
    try{
        if(!req.user){
            res.send(401)
        }else{
            const {place, name, description, date} = req.body
            console.log(req.user.id)
            const vite = await Vite.create({userId: req.user.id, place,name, description, date})
            res.sendStatus(201)({place: vite.place, name: vite.name, description: vite.description, date: vite.date})
        }
    }catch(error){
        next(error)
    }
})
// update vite (once logged in)
app.put('/vites/:id', setUser, async(req,res,next)=>{
    try{
        if(!req.user){
            res.sendStatus(401)
            }else{
                    const {place, name, description, date} = req.body;
                    const vite = await Vite.findByPk(req.params.id)
                    if(!vite){
                        res.sendStatus(404)
                    }else if(vite.userId!== req.user.id){
                        res.sendStatus(403)
            }else{
                await vite.update({place, name, description, date})
                res.sendStatus(200).json({
                    place: vite.place,
                    name: vite.name,
                    description: vite.description,
                    date: vite.date
                })
            }
            
        }
            
    }catch(error){
        next(error)
    }
})
            //     const {place, name, description, date} = req.body;
            //     const vite = await Vite.findByPk(req.params.id)
            // const updateVite = await vite.update({place, name, description,date})
            // res.sendStatus(201)({place: updateVite.place, name: updateVite.name, description: vite.description, date:vite.date})
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