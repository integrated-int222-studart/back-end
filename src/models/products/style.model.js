const { DataTypes } = require('sequelize')
const sequelize = require('../../database/sequelize')
const Product = require('../products/product.model')
const productStyle = require('../ManyToMany/productStyles.model')
const Style = sequelize.define('styles', {
    styleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    styleName: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    timestamps: false
})

module.exports = Style