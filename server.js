const app = require('./index')
const sequelize = require('./db');

const {PORT} = process.env

app.listen(PORT, () =>{
    sequelize.sync({force: false})
    console.log(`Newbee connection ready at http://localhost:${PORT}`);
});