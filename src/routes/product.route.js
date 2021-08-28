const Product = require('../models/products/product.model')
const productType = require('../models/products/productType.model')
const express = require('express')
const router = new express.Router()
const { authUser } = require('../middleware/auth.middleware')

router.post('/addProduct', authUser, async(req, res) => {
    const checkKeyBody = Object.keys(req.body)
    const allowedKey = ['prodName', 'manufacDate', 'prodDescription', 'price', 'productType']
    const inValidKey = checkKeyBody.every((checkKeyBody) => {
        return allowedKey.includes(checkKeyBody)
    })
    if (!inValidKey) {
        await res.status(500).send('Invalid key!')
    }
    try {
        await Product.create({
            prodID: req.body.prodID,
            prodName: req.body.prodName,
            manufacDate: req.body.manufacDate,
            prodDescription: req.body.prodDescription,
            price: req.body.price,
            ownerID: req.user.userID,
            productType: req.body.productType
        })
        res.status(200).send('Product Created!')
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/allProduct', async(req, res) => {
    try {
        const products = await Product.findAll()
        if (!products) res.send('Product not found!')
        await res.send(products)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/product', authUser, async(req, res) => {
    try {
        const product = await Product.findAll({
            where: { ownerID: req.user.userID },
        }, )
        if (!product) res.send('Product not found!')
        await res.send(product)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/typeProd', async(req, res) => {
    try {
        const typeProd = await productType.findAll({
            include: {
                model: Product
            }
        })
        res.send(typeProd)
    } catch (error) {
        res.send(error)
    }
})

router.get('/prodType', async(req, res) => {
    const type = await Product.findAll({
        include: [Product]
    })
    res.send(type)
})

module.exports = router