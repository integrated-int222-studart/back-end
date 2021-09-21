const { DataTypes } = require('sequelize')
const sequelize = require('../../database/sequelize')
const Style = require('../products/style.model')
const Product = require('../products/product.model')
const ProdStyle = sequelize.define('productStyles', {
    styleID: {
        type: DataTypes.INTEGER,
        references: {
            model: Style,
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

module.exports = ProdStyle