const { DataTypes } = require('sequelize')
const sequelize = require('../../database/Sequelize')
const productType = require('../products/productType.model')
const User = require('../user/User.model')
const Product = sequelize.define('products', {
    prodID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    prodName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    manufacDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    prodDescription: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
}, {
    timestamps: false
})

User.hasMany(Product, {
    foreignKey: "ownerID"
})
Product.belongsTo(User, {
    foreignKey: "ownerID"
})

productType.hasMany(Product, {
    foreignKey: "productType"
})
Product.belongsTo(productType, {
    foreignKey: 'productType'
})

async() => await sequelize.sync({ force: true })
module.exports = Product