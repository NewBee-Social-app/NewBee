const {sequelize} = require('./db')
const {Vite} = require('./')
const {User} = require('./User')
const {vites} = require ('./seedData');
const {users} = require ('./seedData')
const bcrypt = require('bcrypt')


const seed = async ()=>{
    await sequelize.sync({force:true});
    await Vite.bulkCreate(vites)
    // await User.bulkCreate(users)
    for(let i=0; i<users.length; i++){
        const user = users[i]
        const hash = await bcrypt.hash(user.password,10)
        await User.create({username: user.username, password: hash, isAdmin: user.isAdmin})
    }
};

module.exports = seed;