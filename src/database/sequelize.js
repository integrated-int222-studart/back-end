const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    define: {
        freezeTableName: true
    }
});

// sequelize.sync();


module.exports = sequelize
    //test connection
    // const connection = async() => {
    //     try {
    //         await sequelize.authenticate();
    //         console.log('Connection has been established successfully.');
    //     } catch (error) {
    //         console.error('Unable to connect to the database:', error);
    //     }
    // }

// connection()