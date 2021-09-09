const Images = require('../../models/products/images.model')
const express = require('express')
const router = new express.Router()
const uploadFile = require('../../middleware/upload.middleware')
const fs = require('fs');
router.post('/image/:id', uploadFile.single('image'), async (req, res, next) => {
    console.log(req.file);

    if (req.file == undefined) {
        return res.send(`You must select a file.`);
    }
    try {
    await Images.create({
        prodID: req.params.id,
        type: req.file.mimetype,
        name: req.file.originalname,
        data: fs.readFileSync(
            process.cwd() + "/src/assets/uploads/" + req.file.filename
        )})

    return res.send(`File has been uploaded.`);
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/photos/:id', async (req, res) => {
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