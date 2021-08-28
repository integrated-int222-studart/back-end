const { DataTypes } = require('sequelize')
const sequelize = require('../../database/sequelize')

const Images = sequelize.define('Images', {
    ImageID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Image: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    }

}, {
    timestamps: false
})

// const test = async() => {
//     const test = await Images.findAll()
//     console.log(test)
// }
// test()

module.exports = Images