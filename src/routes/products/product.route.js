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
        return await res.status(400).send({ message: 'Invalid key!' })
    }
    try {
        const product = await Product.create({
            prodName: req.body.prodName,
            manufacDate: req.body.manufacDate,
            prodDescription: req.body.prodDescription,
            price: req.body.price,
            ownerID: req.user.userID,
            productType: req.body.productType,
        })
        const styles = req.body.styleID
            styles.forEach(async (styleID) => {
            await productStyle.create({
                prodID: product.prodID,
                styleID: styleID
            })
        })
         res.status(201).send(product)
    } catch (error) {
        res.status(500).send({ error: error.massage })
    }
})

router.delete('/deleteProduct/:id', authUser, async (req, res) => {
    try {
        const id = req.params.id
        const hasProduct = await Product.hasProduct(id)
        if (!hasProduct) return res.status(400).send({ message: 'No product with that id!' })
        await Approval.destroy({ where: { prodID: id } })
        await Collection.destroy({ where: { prodID: id } })
        await Favorite.destroy({ where: { prodID: id } })
        await Images.destroy({ where: { prodID: id } })
        await productStyle.destroy({ where: { prodID: id } })
        await Product.destroy({ where: { prodID: id } })
        res.status(200).send({ message: 'Product has been removed' })
    } catch (error) {
        res.status(500).send({ error: error.massage })
    }
})

router.put('/edit/:id', authUser, async (req, res) => {
    try {
        const id = req.params.id
        const hasProduct = await Product.hasProduct(id)
        if (!hasProduct) return res.status(400).send({ message: 'No product with that id!' })
        await Product.update(req.body, {
            where: {
                prodID: id
            }
        })
        res.status(201).send({ message: 'Edit success!' })
    } catch (error) {
        res.status(500).send({ error: error.massage })
    }
})

router.get('/productById/:id', async (req, res) => {
    // try {
    const id = req.params.id
    const hasProduct = await Product.hasProduct(id)
    if (!hasProduct) return res.status(400).send({ message: 'No product with that id!' })
    const productById = await Product.findOne({
        where: {
            prodID: id
        },
        include: [
            {
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

    res.status(200).send(productById)
    // } catch (error) {
    //     res.status(500).send({ error: error.massage })
    // }
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
        // console.log(products)
        if (products.length === 0) return res.status(200).send({ message: 'Product not found!' })
        await res.status(200).send(products)
    } catch (error) {
        res.status(500).send({ error: error.massage })
    }
})

router.get('/product', authUser, async (req, res) => {
    try {
        const product = await Product.findAll({
            where: { ownerID: req.user.userID },
            include: [{
                model: Images,
                attributes: { exclude: ['prodID', 'data'] }
            }]
        }

        )
        if (product.length === 0) return res.status(200).send({ message: 'No product' })
        await res.send(product)
    } catch (error) {
        res.status(500).send({ error: error.massage })
    }
})


router.get('/prodType', async (req, res) => {
    const type = await Product.findAll({
        include: [Product]
    })
    res.send(type)
})

router.get('/products/:userId', async (req, res) => {
    try {
        const id = req.params.userId
        const products = await Product.findAll({
            where: {
                ownerID: id
            },
            include: [{
                model: productType,
            }, {
                model: Style,
                as: 'style'
            },
            {
                model: Images,
                attributes: { exclude: ['data'] },

            }, {
                model: Admin,
                as: 'adminAppoval',
                attributes: { exclude: ['password'] },
            }],
        })

        // const favoriteProd = await Favorite.findAll({ where:{ userID: id }})

        // const collectionProd = await Collection.findAll({ where:{userID: id }})

        // console.log(favoriteProd)
        if (!products) {
            throw new Error()
        }
        res.status(200).send(products)
    } catch (error) {
        res.status(500).send({ error: error.massage })
    }
})

router.get('/page', async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1
        const size = parseInt(req.body.size) || 5
        const query = req.body.query || ''
        const pages = await Product.pagination(page, size, query)
        if (pages.length === 0) return res.status(200).send({ message: 'No product' })
        res.send(pages)
    } catch (error) {
        res.status(500).send({ error: error.massage })
    }

})





module.exports = router