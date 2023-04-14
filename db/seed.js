const {sequelize} = require('./db');
const seed = require('./seedFn');

seed()
.then(()=>{
    console.log("Seeding approved, Newbee adventures created");
})
.catch(err =>{
    console.log(err);
})
.finally(()=>{
    sequelize.close()
})

