const DataTypes = require('sequelize')
const sequelize = require('../../database/Sequelize')
const userToken = sequelize.define('usertokens', {
    tokensID: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
}, {
    timestamps: false
})

module.exports = userToken