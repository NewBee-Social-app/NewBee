const {sequelize} = require('./db')
const {Vite} = require('./')
const {User} = require('./User')
const {vites} = require ('./seedData');
const {users} = require ('./seedData')


const seed = async ()=>{
    await sequelize.sync({force:true});
    await Vite.bulkCreate(vites)
    await User.bulkCreate(users)
};

module.exports = seed;