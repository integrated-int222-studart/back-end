const Images = require('../../models/products/images.model')
const express = require('express')
const router = new express.Router()
const {uploadFileProd} = require('../../middleware/upload.middleware')
const { authUser } = require('../../middleware/auth.middleware')
const fs = require('fs');
router.post('/image/:id', uploadFileProd.single('image'),authUser , async (req, res) => {
    if (req.file == undefined) {
        return res.send(`You must select a file.`);
    }
    
    try {
        await Images.create({
            prodID: req.params.id,
            type: req.file.mimetype,
            name: req.file.originalname,
            data: fs.readFileSync(
                process.cwd() + "/src/assets/uploads/product/" + req.file.filename      
            )
        })
        return res.send(`File has been uploaded.`);
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/photo/:id', authUser ,async (req, res) => {
    const id = req.params.id
    try {
        const image = await Images.findOne({ where: { imageID: id } })
        if (image) {
            res.set('Content-Type', image.type)
            res.end(image.data)
        } else {
            res.send('No image with that id!')
        }
    } catch (error) {
        res.status(500).send(error)
    }
});


module.exports = router