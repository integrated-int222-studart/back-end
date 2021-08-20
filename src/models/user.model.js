const DataTypes = require('sequelize');
const sequelize = require('../database/sequelize')

const User = sequelize.define('users', {
    UserID: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    Username: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    Password: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    FirstName: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    LastName: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    Description: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    Status: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    School: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    Image: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    }

}, {
    timestamps: false
})

const findAllUser = async() => {
    const users = await User.findAll();
    console.log(users.every(user => user instanceof User)); // true
    console.log("All users:", JSON.stringify(users, null, 2));
}

findAllUser()