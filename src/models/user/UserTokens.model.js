const DataTypes = require('sequelize')
const sequelize = require('../../database/sequelize')
const userToken = sequelize.define('userTokens', {
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