const express = require('express')
const router = new express.Router()
const validator = require('validator')
const User = require('../models/user/User.model')
const userToken = require('../models/user/UserTokens.model')
const Product = require('../models/products/product.model')
const productType = require('../models/products/productType.model')
const Style = require('../models/products/style.model')
const Admin = require('../models/admin/Admin.model')
const Image = require('../models/products/images.model')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const { uploadFileUser } = require('../middleware/upload.middleware')
const { authUser } = require('../middleware/auth.middleware')
require('dotenv').config()

router.get('/getAll', async (req, res) => {
    try {
        const users = await User.findAll({
            as: 'users',
            attributes: { exclude: ['password', 'imageData'] },
            include: [{
                model: Product,
                as: 'products',
                // attributes: { exclude: ['ownerID', 'productType'] },
                include: [{
                    model: productType,
                }, {
                    model: Style,
                    as: 'style'
                },
                {
                    model: Image,
                    attributes: { exclude: ['data'] },

                }, {
                    model: Admin,
                    as: 'adminAppoval',
                    attributes: { exclude: ['password'] },
                }],
            },
            {
                model: Product,
                as: 'productFavorite',
                // attributes: { exclude: ['favorlite'] },
                include: [{
                    model: productType,
                }, {
                    model: Style,
                    as: 'style'

                    // attributes: { exclude: ['productstyles'] },
                }],
            },
            {
                model: Product,
                as: 'productCollection',
                // attributes: { exclude: ['ownerID'] },
                include: [{
                    model: productType,
                }, {
                    model: Style,
                    as: 'style'
                    // attributes: { exclude: ['productstyles'] },
                }],
            }],
        })
        if (!users) {
            throw new Error()
        }
        res.status(200).send(users)
    } catch (error) {
        res.status(404).send({ error: error.massage })
    }
})
//be test
router.get('/tokens', async (req, res) => {
    try {
        const token = await userToken.findAll()
        if (!token) return res.status(200).send({ message: 'No token' })
        res.status(200).send(token)
    } catch (error) {
        res.send({ error: error.massage })
    }
})

router.post('/register', async (req, res) => {
    const checkKeyBody = Object.keys(req.body)
    const allowedKey = ['username', 'email', 'password', 'status', 'firstName', 'lastName', 'description', 'school']
    const isValidKey = checkKeyBody.every((checkKeyBody) => {
        return allowedKey.includes(checkKeyBody)
    })
    if (!isValidKey) {
        return res.status(400).send({ message: 'Invalid key!' })
    }
    try {
        const userWithEmail = await User.findOne({ where: { email: req.body.email } })
        const userWithUsername = await User.findOne({ where: { username: req.body.username } })
        const isEmail = validator.isEmail(req.body.email)
        const isStrongPass = validator.isStrongPassword(req.body.password)
        if (userWithUsername) return res.status(400).send({ message: 'Username has been used!' })
        if (userWithEmail) return res.status(400).send({ message: 'Email has been used!' })
        // if (isStrongPass == false) return res.status(400).send({ message: 'Password not strong!' })
        if (isEmail == false) return res.status(400).send({ message: 'Email is invalid' })


        const user = await User.create({
            username: req.body.username.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            status: req.body.status,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            description: req.body.description,
            school: req.body.school,
        })

        if (!user) return res.status(400).send({ message: 'Please fill out the information' })
        res.status(201).send({ message: "Successful" })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.post('/login', async (req, res) => {
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
        res.send({ token })
    } catch (error) {
        res.status(400).send({ message: 'Email or Password is wrong!' })
    }
})

router.delete('/logout', authUser, async (req, res) => {
    try {
        await userToken.destroy({ where: { token: req.token }, force: true })
        res.status(200).send({ message: 'Logout!' })
    } catch (error) {
        res.status(500).send({ error: error.massage })
    }
})

router.delete('/logoutAll', authUser, async (req, res) => {
    try {
        await userToken.destroy({ where: { userID: req.user.userID }, force: true })
        res.status(200).send({ message: 'Logout all device!' })
    } catch (error) {
        res.send({ error: error.massage })
    }
})

router.get('/profile/:username', async (req, res) => {
    try {
        const profile= await User.findOne({
            where: {
                username: req.params.username
            },
            as: 'users',
            attributes: { exclude: ['password', 'imageData'] },
        })
        if (!profile) {
            throw new Error()
        }
        res.status(200).send(profile)
    } catch (error) {
        res.status(404).send({ error: error.massage })
    }
})
router.get('/profile', authUser, (req, res) => {
    try {
        res.status(200).send({ user: req.user })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
router.post('/upload/image', uploadFileUser.single('image'), authUser, async (req, res) => {
    if (req.file == undefined) {
        return res.status(400).send({ message:`You must select a file.`});
    }
    try {
        await User.update({
            imageType: req.file.mimetype,
            imageName: req.file.originalname,
            imageURL: `${process.env.IP_API}/user/photo/${req.user.userID}`,
            imageData: fs.readFileSync(
                process.cwd() + "/src/assets/uploads/user/" + req.file.filename
            )
        }, {
            where: {
                userID: req.user.userID
            }
        })
        return res.status(200).send({ message:`File has been uploaded.`});
    } catch (error) {
        res.status(500).send({ error: error.massage })
    }
})
router.get('/getImage', async (req, res) => {

    try {
        const image = await User.findOne({ where: { userID: req.user.userID } })
        console.log(image)
        if (!image) throw new Error()
        res.set('Content-Type', image.imageType)
        res.end(image.imageData)
    } catch (error) {
        res.status(500).send({ error: error.massage })
    }
});



module.exports = router