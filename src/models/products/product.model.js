const { DataTypes, Op } = require('sequelize')
const sequelize = require('../../database/sequelize')
const productType = require('./productType.model')
const User = require('../user/User.model')
const Images = require('./images.model')
const Favorite = require('../ManyToMany/favorite.model')
const Collection = require('../ManyToMany/collections.model')
const Style = require('../products/style.model')
const productStyle = require('../ManyToMany/productStyles.model')
const Appoval = require('../ManyToMany/approval.model')
const Admin = require('../admin/Admin.model')
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

//User -->> Product <<-- productType
User.hasMany(
    Product, {
        as: 'products',
        foreignKey: 'ownerID'
    })
Product.belongsTo(User, {
    as: 'users',
    foreignKey: 'ownerID'
})
productType.hasMany(Product, {
    foreignKey: 'productType'
})
Product.belongsTo(productType, {
    foreignKey: 'productType'
})

//M:N Favorite 
User.belongsToMany(Product, {
    through: Favorite,
    as: 'productFavorite',
    timestamps: false,
    foreignKey: 'userID'
})
Product.belongsToMany(User, {
    through: Favorite,
    as: 'usersFavorite',
    timestamps: false,
    foreignKey: 'prodID'
})

//M:N Collection
User.belongsToMany(Product, {
    through: Collection,
    as: 'productCollection',
    timestamps: false,
    foreignKey: 'userID'
})

Product.belongsToMany(User, {
    through: Collection,
    as: 'userCollection',
    timestamps: false,
    foreignKey: 'prodID'
})

//M:N ProductStyle
Style.belongsToMany(Product, {
    through: productStyle,
    as: 'productStyle',
    timestamps: false,
    foreignKey: 'styleID'
})
Product.belongsToMany(Style, {
    through: productStyle,
    as: 'style',
    timestamps: false,
    foreignKey: 'prodID'
})


//M:N ProductAppoval
Admin.belongsToMany(Product, {
    through: Appoval,
    as: 'prodAppoval',
    timestamps: false,
    foreignKey: 'adminID'
})
Product.belongsToMany(Admin, {
    through: Appoval,
    as: 'adminAppoval',
    timestamps: false,
    foreignKey: 'prodID'
})

//Product -->> Images
Product.hasMany(Images, {
    foreignKey: 'prodID'
})

//paging
Product.Pagination = async(page, size, query) => {
    const pageAndItem = await Product.findAll({
        limit: size || 5,
        offset: (page - 1) * size,
        where: {
            prodName: {
                [Op.like]: `%${query}%`
            }
        }
    })
    return pageAndItem
}

module.exports = Product