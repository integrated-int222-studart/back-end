const Images = require('../../models/products/images.model')
const express = require('express')
const router = new express.Router()

router.post('/addImage', async(req, res) => {
    const checkKeyBody = Object.keys(req.body)
    const allowedKey = ['image', 'prodID']
    const isValidKey = checkKeyBody.every((checkKey) => {
        return allowedKey.includes(checkKey)
    })
    console.log(req.body)
    if (!isValidKey) return res.status(500).send('Invalid key!')
    try {
        await Images.create(req.body)
        res.status(201).send('Image has created')
    } catch (error) {
        res.status(500).send(error)
    }
})


module.exports = router