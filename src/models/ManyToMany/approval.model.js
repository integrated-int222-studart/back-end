const { DataTypes } = require('sequelize')
const sequelize = require('../../database/sequelize')
const Admin = require('../admin/Admin.model')
const Product = require('../products/product.model')
const Approval = sequelize.define('approval', {
    adminID: {
        type: DataTypes.INTEGER,
        references: {
            model: Admin,
            key: 'adminID'
        },
        allowNull: false
    },
    prodID: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'prodID'
        },
        allowNull: false
    },
    approveDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
}, {
    timestamps: false,
})

module.exports = Approval