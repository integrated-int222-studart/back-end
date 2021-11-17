const express = require('express')
const router = new express.Router()
const Style = require('../../models/products/style.model')
const productStyle = require('../../models/ManyToMany/productStyles.model')
const Product = require('../../models/products/product.model')
const productType = require('../../models/products/productType.model')
const Images = require('../../models/products/images.model')
router.get('/allStyle', async (req, res) => {
    try {
        const style = await Style.findAll()
        if (!style) return res.send({ message: 'No style' })
        res.status(200).send(style)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.put('/editStyle/:prodId', async (req, res) => {
    try {
        const prodID = parseInt(req.params.prodId)
        const stylesID = req.body.styleID
        await productStyle.destroy({
            where: {
                prodID
            }
        })
        let data = []
        for (let i = 0; i < stylesID.length; i++) {
            data.push({ prodID, styleID: stylesID[i] })
        }
        await productStyle.bulkCreate(data)

        const productWithStyle = await Product.findOne({
            where: {
                prodID
            },
            include: [{
                model: Style,
                as: 'style',
                attributes: { exclude: ['productStyles'] }
            },{
                model: productType,
            },{
                model: Images,
                attributes: { exclude: ['data'] },

            }]
        })
        res.status(201).send(productWithStyle)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
module.exports = router