const { DataTypes } = require('sequelize')
const sequelize = require('../../database/sequelize')

const adminToken = sequelize.define('adminTokens', {
    tokensID: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    timestamps: false
})


module.exports = adminToken