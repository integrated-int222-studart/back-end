const { DataTypes } = require('sequelize')
const sequelize = require('../../database/Sequelize')
const bcrypt = require('bcryptjs')
const userToken = require('./UserTokens.model')
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
        unique: true,
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

//one to many for User to userTokens
User.hasMany(userToken, {
    foreignKey: 'userID'
})


//Checking email and password for login
User.findByCredentials = async(email, password) => {
    const user = await User.findOne({ where: { email: email } })
    if (!user) {
        throw Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw Error('Unable to login')
    }
    return user
}


// Hash the plain text password before saving
User.beforeCreate(async function(user) {
    const salt = await bcrypt.genSalt(8)
    user.password = await bcrypt.hash(user.password, salt)
})



module.exports = User