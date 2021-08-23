const { DataTypes } = require('sequelize')
const sequelize = require('../../database/Sequelize')
const bcrypt = require('bcryptjs')

const adminToken = sequelize.define('admintokens', {
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