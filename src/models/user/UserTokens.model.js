const DataTypes = require('sequelize')
const sequelize = require('../../database/Sequelize')
const tokenUser = sequelize.define('usertokens', {
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

module.exports = tokenUser