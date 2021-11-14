const { DataTypes } = require('sequelize')
const sequelize = require('../../database/sequelize')
const Admin = require('../admin/Admin.model')
const Product = require('../products/product.model')
const Approval = sequelize.define('approval', {
    approvalID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    adminID: {
        type: DataTypes.INTEGER,
        references: {
            model: Admin,
            key: 'adminID',
        },
        
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
        allowNull: true
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false
    }
}, {
    timestamps: false,
})

module.exports = Approval