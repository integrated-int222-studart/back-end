const jwt = require('jsonwebtoken')
const User = require('../models/user/User.model')
const userTokens = require('../models/user/UserTokens.model')
require('dotenv').config()
const auth = async(req, res, next) => {
    try {
        const token = await req.header('Authorization').replace('Bearer ', '')
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({
            where: { userID: decode.userID }
        })
        if (!user) {
            throw new Error()
        }
        const isMatchToken = await userTokens.findOne({ where: { userID: decode.userID } })
            // const isMatchToken = await userTokens.findOne({ token })
        console.log("Token:")
        console.log(isMatchToken)
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

module.exports = auth