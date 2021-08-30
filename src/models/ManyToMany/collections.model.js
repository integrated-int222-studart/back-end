const { DataTypes } = require('sequelize')
const sequelize = require('../../database/sequelize')
const Product = require('../products/product.model')
const User = require('../user/User.model')
const Collection = sequelize.define('collections', {
    purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    prodID: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'prodID'
        }
    },
    userID: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'userID'
        }
    }
}, {
    timestamps: false
})






module.exports = Collection