const {Sequelize, sequelize} = require('./db')

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    isAdmin: Sequelize.BOOLEAN,
   
});

module.exports ={ User };
