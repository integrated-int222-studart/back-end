const express = require('express')
const router = new express.Router()
const Style = require('../../models/products/style.model')
const productStyle = require('../../models/ManyToMany/productStyles.model')
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
        stylesID.forEach(async styleID => {
            await productStyle.create({
                prodID: prodID,
                styleID
            })
        });
    res.status(201).send({message:'product style updated'})
        
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
module.exports = router