const Images = require('../../models/products/images.model')
const express = require('express')
const router = new express.Router()
const Product = require('../../models/products/product.model')
const User = require('../../models/user/User.model')
const { uploadFileProd } = require('../../middleware/upload.middleware')
var AdmZip = require("adm-zip");
const { authUser } = require('../../middleware/auth.middleware')
const fs = require('fs');
router.post('/upload/:prouctId', authUser, uploadFileProd.array('image'), async (req, res) => {
    if (req.files == undefined) {
        return res.send({ message: `You must select a file.` });
    }
    try {

        for (i = 0; i < req.files.length; i++) {
            await Images.create({
                prodID: req.params.prouctId,
                type: req.files[i].mimetype,
                name: req.files[i].filename,
                data: fs.readFileSync(
                    process.cwd() + "/src/assets/uploads/product/" + req.files[i].filename
                )
            }).then(result => {
                Images.update({
                    url: `${process.env.IP_API}/image/get/${result.imageID}`
                }, {
                    where: {
                        imageID: result.imageID
                    }
                })
            })
        }
        res.status(200).send({ message: `File has been uploaded.` });
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.get('/get/:imageId', async (req, res) => {
    const id = req.params.imageId
    try {
        const image = await Images.findOne({ where: { imageID: id } })
        if (image) {
            res.set('Content-Type', image.type)
            res.send(image.data)
        } else {
            res.status(400).send({ message: 'No image with that id!' })
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});

router.get('/download/:prodId', authUser, async (req, res) => {
    try {
        const prodID = req.params.prodId
        const product = await Product.findOne({
            where: {
                prodID
            },
            include: [{
                model: Images,
                attributes: { exclude: ['data'] }
            }]
        })
        let arrImage = []
        product.images.forEach(element => {
            arrImage.push(element.name)
        });
        const zip = new AdmZip()
        if(arrImage.length === 0) return res.send({message:'No image for download with that id'})
        if (arrImage) {
            for (i = 0; i < arrImage.length; i++) {
                zip.addLocalFile('./src/assets/uploads/product/' + arrImage[i])
            }
        }
        const outputPath = process.cwd() + "/src/assets/downloads/" + Date.now() + 'studart.zip'
        fs.writeFileSync(outputPath, zip.toBuffer())
        res.download(outputPath)

    } catch (error) {
        res.status(500).send({ error: error.message })
    }

})


module.exports = router