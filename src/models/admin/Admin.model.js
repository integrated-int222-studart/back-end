const { DataTypes } = require('sequelize')
const sequelize = require('../../database/sequelize')
const bcrypt = require('bcryptjs')
const adminToken = require('./AdminTokens.model')

const Admin = sequelize.define('admins', {
    adminID: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    timestamps: false
})

//one to many for Admin to adminToken
Admin.hasMany(adminToken, {
    foreignKey: 'adminID'
})

//Checking email and password for login
Admin.findByCredentials = async(email, password) => {
    const admin = await Admin.findOne({ where: { email: email } })
    if (!admin) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return admin
}

// Hash the plain text password manual
// const encryptPassword = async() => {
//     const adminPass = 'admin'
//     const salt = await bcrypt.genSalt(8)
//     const password = await bcrypt.hash(adminPass, salt)
//     console.log(password)
// }
// encryptPassword()

module.exports = Admin