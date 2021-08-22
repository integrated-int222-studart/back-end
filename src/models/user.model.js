const { DataTypes } = require('sequelize')
const sequelize = require('../database/sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const tokenUser = require('./UserTokens.model')
require('dotenv').config()
const User = sequelize.define('users', {
    userID: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    lastName: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    description: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    school: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    image: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    }

}, {
    timestamps: false
})

User.hasMany(tokenUser, {
    foreignKey: 'userID'
})



//Checking email and password for login
User.findByCredentials = async(email, password) => {
    // console.log(email)
    const user = await User.findOne({ where: { email: email } })
    console.log({ user })
    if (!user) {
        throw Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw Error('Unable to login')
    }
    return user
}

// User.generateAuthToken = async function() {
//     const user = this
//     const token = jwt.sign({ userID: user.userID.toString() }, process.env.JWT_SECRET)
//     const generateTokenID = await tokenUser.create({
//         token: token,
//         userID: user.userID
//     })
//     await generateTokenID.save()
//     return token
//  user.usertokens.push({ token })
// await user.save()
// return token
// }


// Hash the plain text password before saving
User.beforeCreate(async function(user) {
        const salt = await bcrypt.genSalt(8)
        user.password = await bcrypt.hash(user.password, salt)
    })
    // check password 
    // const checkPass = User.prototype.validPassword = async(password) => {
    //     return await bcrypt.compare(password, this.password)
    // }

module.exports = User

// const findAllUser = async() => {
//     const users = await User.findAll();
//     console.log(users.every(user => user instanceof User)); // true
//     console.log("All users:", JSON.stringify(users, null, 2));
// }

// findAllUser()