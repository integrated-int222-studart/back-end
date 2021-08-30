const { DataTypes } = require('sequelize')
const sequelize = require('../../database/sequelize')

const Images = sequelize.define('images', {
    imageID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    image: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    }

}, {
    timestamps: false
})


module.exports = Images