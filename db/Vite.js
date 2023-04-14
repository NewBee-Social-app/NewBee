const {Sequelize, sequelize} = require('db')

const Vite = sequelize.define('vite', {
    place: Sequelize.STRING,
    name : Sequelize.STRING,
    description: Sequelize.STRING,
    date: Sequelize.STRING
});

module.exports ={ Vite };