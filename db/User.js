const {Sequelize, sequelize} = require('./db')

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    isAdmin: {
        type:Sequelize.BOOLEAN,
        defaultValue: false,
    }
   
});

module.exports ={ User };
