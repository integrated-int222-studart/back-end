const express = require('express')
const router = new express.Router()
const { authUser } = require('../../middleware/auth.middleware')
const Favorite = require('../../models/ManyToMany/favorite.model')
router.post('/addFavorite/:prodId', authUser, async (req, res) => {
    try {
        const productId = parseInt(req.params.prodId) 
            await Favorite.create({
            userID: req.user.userID,
            prodID: productId
         })
         res.status(201).send({message: 'Favorites have updated'})
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.delete('/deleteFavorite/:prodId',authUser, async(req,res) =>{
    try {
        const productId = parseInt(req.params.prodId) 
        await Favorite.destroy({
            where:{
                userID: req.user.userID,
                prodID: productId
            }
        })
        res.status(201).send({message: 'Favorites have removed'})
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.get('/favorite/:userId',async (req,res)=>{
    try {
        const userID = req.params.userId
        const favorites = await Favorite.findAndCountAll({
            where:{
                userID,
            }
        })
        res.status(200).send(favorites)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }

    // const favorites = await User.findAll({
    //     where:{
    //         userID,
    //     },
    //     attributes: {exclude:["userID","password","email","firstName","lastName","description","status","school","imageData","imageName","imageType","imageURL"]},
    //     include:[{
    //         model: Product,
    //         as: 'productFavorite'
    //     }]
    // })
})

module.exports = router