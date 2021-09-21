const { DataTypes } = require('sequelize')
const sequelize = require('../../database/sequelize')

const Images = sequelize.define('images', {
    imageID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    data: {
        type: DataTypes.BLOB('long'),
        allowNull: false
    },
    name:{
        type: DataTypes.STRING(45),
        allowNull: false
    },
    type:{
        type: DataTypes.STRING(45),
        allowNull: false
    }

}, {
    timestamps: false
})


module.exports = Images