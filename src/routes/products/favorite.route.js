const express = require('express')
const router = new express.Router()
const { authUser } = require('../../middleware/auth.middleware')
const Favorite = require('../../models/ManyToMany/favorite.model')
const Product = require('../../models/products/product.model')
const productType = require('../../models/products/productType.model')
const Style = require('../../models/products/style.model')
const User = require('../../models/user/User.model')
const Image = require('../../models/products/images.model')
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
        const favoriteUser = await User.findOne({
            as: 'users',
            attributes: {exclude:["userID","username","password","email","firstName","lastName","description","status","school","imageData","imageName","imageType","imageURL"]},
            where: {
                userID
            },
            include: [{
                model: Product,
                as: 'productFavorite',
                // attributes: { exclude: ['favorlite'] },
                include: [{
                    model: Image,
                    attributes: { exclude: ['data'] }
                },{
                    model: productType,
                }, {
                    model: Style,
                    as: 'style'
                    // attributes: { exclude: ['productstyles'] },
                }],
            },]
        })
        res.status(200).send(favoriteUser)
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