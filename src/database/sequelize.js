const Sequelize = require('sequelize')
require('dotenv').config()

// const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
//     host: process.env.HOST,
//     dialect: process.env.DIALECT,
//     define: {
//         freezeTableName: true
//     }
// });
const sequelize = new Sequelize(process.env.CONECTION, {
    define: {
        freezeTableName: true
    }
})
// sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });
const testConnection = async()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
testConnection()

module.exports = sequelize