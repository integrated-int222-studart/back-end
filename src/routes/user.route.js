const express = require('express')
const router = new express.Router()
const validator = require('validator')
const User = require('../models/user/User.model')
const userToken = require('../models/user/UserTokens.model')
const Product = require('../models/products/product.model')
const productType = require('../models/products/productType.model')
const jwt = require('jsonwebtoken')
const { authUser } = require('../middleware/auth.middleware')
require('dotenv').config()
router.get('/getAll', async(req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [{
                model: Product,
                attributes: { exclude: ['ownerID', 'productType'] },
                include: {
                    model: productType
                }
            }, {
                model: userToken
            }, ],
        })
        if (!users) {
            throw new Error()
        }
        res.send(users)
    } catch (error) {
        res.status(404).send(error)
    }
})
router.get('/tokens', async(req, res) => {
    try {
        const token = await userToken.findAll()
        if (token) {
            res.send(token)
        } else {
            res.status(500).send()
        }
    } catch (error) {
        res.send(error)
    }
})

router.post('/register', async(req, res) => {
    const checkKeyBody = Object.keys(req.body)
    const allowedKey = ['username', 'email', 'password', 'status', 'firstName', 'lastName', 'description', 'school', 'image']
    const isValidKey = checkKeyBody.every((checkKeyBody) => {
        return allowedKey.includes(checkKeyBody)
    })
    if (!isValidKey) {
        res.status(500).send('Invalid key!')
    }
    try {
        const user = await new User(req.body)
        const userWithEmail = await User.findOne({ where: { email: req.body.email } })
        const userWithUsername = await User.findOne({ where: { username: req.body.username } })
        if (userWithUsername) res.send('Username has been used!')
        if (userWithEmail) res.send('Email has been used!')
        if (!validator.isEmail(req.body.email)) res.send('Email is invalid')
        if (user) {
            await user.save()
            res.status(201).send("Successful")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async(req, res) => {
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)
        if (!user) {
            throw new Error()
        }
        const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET)
        const generateTokenID = await new userToken({
            userID: user.userID,
            token: token,
        })
        await generateTokenID.save()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send('Email or Password is wrong!')
    }
})
router.delete('/logout', authUser, async(req, res) => {
    try {
        await userToken.destroy({ where: { token: req.token }, force: true })
        res.status(200).send('Logout!')
    } catch (error) {
        res.send(error)
    }
})
router.delete('/logoutAll', authUser, async(req, res) => {
    try {
        await userToken.destroy({ where: { userID: req.user.userID }, force: true })
        res.status(200).send('Logout!')
    } catch (error) {
        res.send(error)
    }
})
router.get('/profile', authUser, (req, res) => {
    res.send({ user: req.user, token: req.token })
})



module.exports = router