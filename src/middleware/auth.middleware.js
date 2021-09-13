const jwt = require('jsonwebtoken')
const User = require('../models/user/User.model')
const userTokens = require('../models/user/UserTokens.model')
const Admin = require('../models/admin/Admin.model')
const adminTokens = require('../models/admin/AdminTokens.model')
const Product = require('../models/products/product.model')
require('dotenv').config()
const authUser = async(req, res, next) => {
    try {
        const token = await req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({
            attributes: { exclude: ['password','imageData'] },
            where: { userID: decode.userID }
        })
        if (!user) {
            throw new Error()
        }
        const isMatchToken = await userTokens.findOne({ where: { token } })
        if (!isMatchToken) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}

const authAdmin = async(req, res, next) => {
    try {
        const token = await req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({
            where: { adminID: decode.adminID }
        })
        if (!admin) {
            throw new Error()
        }
        const isMatchToken = await adminTokens.findOne({ where: { token } })
        if (!isMatchToken) {
            throw new Error()
        }
        req.token = token
        req.admin = admin
        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}

module.exports = { authUser, authAdmin }