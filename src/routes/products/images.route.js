const Images = require('../../models/products/images.model')
const express = require('express')
const router = new express.Router()
const { uploadFileProd } = require('../../middleware/upload.middleware')
const { authUser } = require('../../middleware/auth.middleware')
const fs = require('fs');
router.post('/image/:id', uploadFileProd.array('image'), async (req, res) => {
    if (req.files == undefined) {
        return res.send({ message: `You must select a file.` });
    }
    try {
        for (i = 0; i < req.files.length; i++) {
            console.log(req.files[i])
            await Images.create({
                prodID: req.params.id,
                type: req.files[i].mimetype,
                name: req.files[i].originalname,
                data: fs.readFileSync(
                    process.cwd() + "/src/assets/uploads/product/" + req.files[i].filename
                )
            }).then(result => {
                Images.update({
                    url: `${process.env.IP_API}/upload/photo/${result.imageID}`
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

router.get('/photo/:id', authUser, async (req, res) => {
    const id = req.params.id
    try {
        const image = await Images.findOne({ where: { imageID: id } })
        if (image) {
            res.set('Content-Type', image.type)
            res.send(image.data)
        } else {
            res.send({ message: 'No image with that id!' })
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});


module.exports = router