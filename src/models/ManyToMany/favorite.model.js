const { DataTypes } = require('sequelize')
const sequelize = require('../../database/sequelize')
const Product = require('../products/product.model')
const Favorite = sequelize.define('favorite', {
    userID: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'userID'
        }
    },
    prodID: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'prodID'
        }
    }
}, {
    timestamps: false
})

module.exports = Favorite