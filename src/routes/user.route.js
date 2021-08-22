const express = require('express')
const router = new express.Router()
const validator = require('validator')
const User = require('../models/user.model')
const userToken = require('../models/UserTokens.model')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth.middleware')
require('dotenv').config()
router.get('/getAll', async(req, res) => {
    try {
        const users = await User.findAll({
            include: [userToken]
        })
        if (users) {
            res.send(users)
        } else {
            res.status(500).send()
        }
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
    try {
        const user = await new User(req.body)
        const userWithEmail = await User.findOne({ where: { email: req.body.email } })
        const userWithUsername = await User.findOne({ where: { username: req.body.username } })
        if (userWithUsername) res.send('Username has been used!')
        if (userWithEmail) res.send('Email has been used!')
        if (!validator.isEmail(req.body.email)) res.send('Email is invalid')
        if (user) {
            await user.save()
            res.status(201).send(user)
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = jwt.sign({ id: user.userID }, process.env.JWT_SECRET)
            // console.log({ token: token })
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




router.post('/logout', auth, async(req, res) => {
    try {
        await userToken.destroy({ where: { userID: req.user.userID }, force: true })
        res.status(200).send('Logout!')
    } catch (error) {
        res.send(error)
    }
})
router.get('/profile', auth, (req, res) => {
    res.send({ user: req.user, token: req.token })
})

module.exports = router