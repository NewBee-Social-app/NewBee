const {sequelize} = require('./db')
const {Vite} = require('./')
const {vites} = require ('./seedData');


const seed = async ()=>{
    await sequelize.sync({force:true});
    await Vite.bulkCreate(vites)
};

module.exports = seed;