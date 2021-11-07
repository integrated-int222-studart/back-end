const express = require('express')
const router = new express.Router()
const { authUser } = require('../../middleware/auth.middleware')
const Collection = require('../../models/ManyToMany/collections.model')
const Product = require('../../models/products/product.model')
const User = require('../../models/user/User.model')
const Image = require('../../models/products/images.model')
const productType = require('../../models/products/productType.model')
const Style = require('../../models/products/style.model')
router.post('/addCollection/:prodId', authUser, async (req, res) => {
    try {
        const prodID = req.params.prodId
        await Collection.create({
            prodID,
            userID: req.user.userID,
            purchaseDate: req.body.purchaseDate
        })
        res.status(201).send('Added to collection')
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.get('/collection/:userId', async (req, res) => {
    try {
        const userID = req.params.userId
        const collectionUser = await User.findOne({
            as: 'users',
            attributes: {exclude:["userID","username","password","email","firstName","lastName","description","status","school","imageData","imageName","imageType","imageURL"]},
            where: {
                userID
            },
            include: [{
                model: Product,
                as: 'productCollection',
                include: [{
                    model: Image,
                    attributes: { exclude: ['data'] }
                }, {
                    model: productType,
                }, {
                    model: Style,
                    as: 'style'
                },]
            }]
        })
        if (collectionUser.length === 0) return res.status(200).send({ message: 'No collecion' })
        res.status(200).send(collectionUser)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router