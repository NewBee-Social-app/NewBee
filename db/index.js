const {Vite} = require('./Vite');
const {User} = require('./User');
const {sequelize, Sequelize} = require('./db')

Vite.belongsTo(User,{foreignKey: 'userId'})
User.hasMany(Vite)

module.exports ={
    Vite,
    User,
    sequelize,
    Sequelize
};