const Product = require('../../models/products/product.model')
const Images = require('../../models/products/images.model')
const express = require('express')
const router = new express.Router()
const { authUser } = require('../../middleware/auth.middleware')

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
                include: [{
                    model: Images,
                    attributes: { exclude: ['prodID'] }
                }]
            }

        )
        if (!product) res.send('Product not found!')
        await res.send(product)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/prodType', async(req, res) => {
    const type = await Product.findAll({
        include: [Product]
    })
    res.send(type)
})

router.get('/page', async(req, res) => {
    try {
        const page = parseInt(req.body.page || 1)
        const size = parseInt(req.body.size || 5)
        const query = req.body.query || ''
        const pages = await Product.Pagination(page, size, query)
        if (!pages) {
            res.status(404).send('Not found item!')
        } else {

        }
        res.send(pages)
    } catch (error) {
        res.status(500).send(error)
    }

})

module.exports = router