const { DataTypes } = require('sequelize')
const sequelize = require('../../database/sequelize')
const Type = sequelize.define('type', {
    typeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    typeName: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    timestamps: false
})



module.exports = Type