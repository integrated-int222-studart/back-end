const express = require('express')
const router = new express.Router()
const Style = require('../../models/products/style.model')

router.get('/allStyle', async(req,res)=>{
    try {
        const style = await Style.findAll()
        if(!style) return res.send({message:'No style'})
        res.status(200).send(style)
    } catch (error) {
        res.status(500).send({error:error.message})
    }
})

module.exports = router