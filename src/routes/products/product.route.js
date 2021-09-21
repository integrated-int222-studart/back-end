const Product = require('../../models/products/product.model')
const Images = require('../../models/products/images.model')
const productType = require('../../models/products/productType.model')
const productStyle = require('../../models/ManyToMany/productStyles.model')
const Style = require('../../models/products/style.model')
const Admin = require('../../models/admin/Admin.model')
const Favorite = require('../../models/ManyToMany/favorite.model')
const Collection = require('../../models/ManyToMany/collections.model')
const Approval = require('../../models/ManyToMany/approval.model')
const express = require('express')
const router = new express.Router()
const { authUser } = require('../../middleware/auth.middleware')


router.post('/addProduct', authUser, async (req, res) => {
    const checkKeyBody = Object.keys(req.body)
    const allowedKey = ['prodName', 'manufacDate', 'prodDescription', 'price', 'productType', 'styleID', 'image']
    const inValidKey = checkKeyBody.every((checkKeyBody) => {
        return allowedKey.includes(checkKeyBody)
    })
    if (!inValidKey) {
        return await res.status(500).send('Invalid key!')
    }
    try {
        await Product.create({
            prodName: req.body.prodName,
            manufacDate: req.body.manufacDate,
            prodDescription: req.body.prodDescription,
            price: req.body.price,
            ownerID: req.user.userID,
            productType: req.body.productType,
        }).then((result) => {
            const styles = req.body.styleID
            styles.forEach(styleID => {
                productStyle.create({
                    prodID: result.prodID,
                    styleID: styleID
                })
            });
            res.send('Product has been created')
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            res.status(400).send('Enter variable param')
        }
        await Approval.destroy({ where: { prodID: id } })
        await Collection.destroy({ where: { prodID: id } })
        await Favorite.destroy({ where: { prodID: id } })
        await Images.destroy({ where: { prodID: id } })
        await productStyle.destroy({ where: { prodID: id } })
        await Product.destroy({ where: { prodID: id } })
        res.send('Product has been removed')
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put('/edit/:id', async(req,res)=>{
    const id = req.params.id
    try {
        await Product.update(req.body,{
            where:{
                prodID: id
            }
        })
        res.send('Edit success!')
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/productById/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            res.status(400).send('Enter variable param')
        }
        const productById = await Product.findOne({
            where: {
                prodID: id
            },
            include: [{
                model: productType,
            }, {
                model: Style,
                as: 'style',
                attributes: { exclude: ['productStyles'] }
            },
            {
                model: Images
            }, {
                model: Admin,
                as: 'adminAppoval',
                attributes: { exclude: ['password'] },
            }]
        })
        console.log(productById)
        res.send(productById)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/allProduct', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: productType,
            }, {
                model: Style,
                as: 'style',
                attributes: { exclude: ['productStyles'] }
            },
            {
                model: Images,
                attributes: { exclude: ['data'] }
            }, {
                model: Admin,
                as: 'adminAppoval',
                attributes: { exclude: ['password'] },
            }]
        })
        if (!products) res.send('Product not found!')
        await res.send(products)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/product', authUser, async (req, res) => {
    try {
        const product = await Product.findAll({
            where: { ownerID: req.user.userID },
            include: [{
                model: Images,
                attributes: { exclude: ['prodID','data'] }
            }]
        }

        )
        if (!product) res.send('Product not found!')
        await res.send(product)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/prodType', async (req, res) => {
    const type = await Product.findAll({
        include: [Product]
    })
    res.send(type)
})

router.get('/page', async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1
        const size = parseInt(req.body.size) || 5
        const query = req.body.query || ''
        const pages = await Product.Pagination(page, size, query)
        if (!pages) {
            res.status(404).send('Item not found!')
        } else {

        }
        res.send(pages)
    } catch (error) {
        res.status(500).send(error)
    }

})




module.exports = router