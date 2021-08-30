const productType = require('../../models/products/productType.model')
const Product = require('../../models/products/product.model')
const express = require('express')
const router = new express.Router()

router.post('/addType', async(req, res) => {
    const checkKeyBody = Object.keys(req.body)
    const allowedKey = ['typeName']
    const isValidKey = checkKeyBody.every((checkKeyBody) => {
        return allowedKey.includes(checkKeyBody)
    })
    if (!isValidKey) {
        return res.status(404).send('Invalid key!')
    }
    const checkTypeName = await productType.findOne({ where: { typeName: req.body.typeName } })
    try {
        if (checkTypeName) {
            res.status(404).send('This type has been used')
        }
        await productType.create(req.body)
        res.send('Type Created!')
    } catch (error) {
        res.status(500).send(error)
    }

})

router.get('/allType', async(req, res) => {
    const types = await productType.findAll()
    res.send(types)
})

router.get('/typeProd', async(req, res) => {
    const typeProd = await productType.findAll({
        include: {
            model: Product
        }
    })
    res.send(typeProd)
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

module.exports = router