const express = require('express')
const router = new express.Router()
const { authUser } = require('../../middleware/auth.middleware')
const Collection = require('../../models/ManyToMany/collections.model')

router.post('/addCollection/:prodId',authUser,async (req,res) =>{
    try {
        const prodID = req.params.prodId
        await Collection.create({
                prodID,
                userID: req.user.userID,
                purchaseDate: req.body.purchaseDate 
        })
        res.status(201).send('Added to collection')
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

router.get('/collection/:userId',async(req,res) =>{
    try {
        const userID = req.params.userId
        const collection = await Collection.findAll({
            where:{
                userID
            }
        })
        if(collection.length === 0) return res.status(200).send({message:'No collecion'})
        res.status(200).send(collection)
    } catch (error) {
        res.status(500).send({error: error.message})  
    }
})

module.exports = router