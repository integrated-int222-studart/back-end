const multer = require("multer");
const fs = require('fs');
const Images = require('../models/products/images.model')
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

const storageProduct = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.cwd() + "/src/assets/uploads/product/");
    },
    filename: (req, file, cb) => {
        cb(null, 'file-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    },
});


const uploadFileProd = multer({ storage: storageProduct, fileFilter: imageFilter });



const imageFilterUser = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};
const storageUser = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.cwd() + "/src/assets/uploads/user/");
    },
    filename: (req, file, cb) => {
        cb(null, 'file-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    },
});

const dirUser = process.cwd() + '/src/assets/uploads/user'
if (!fs.existsSync(dirUser)) {
    fs.mkdirSync(dirUser, { recursive: true })
}

const dirProduct = process.cwd() + '/src/assets/uploads/product'
if (!fs.existsSync(dirProduct)) {
    const imageDB = (async()=>{
       const image =  await Images.findAll({
        })
            for(i=0;i<image.length;i++){
                const filename = process.cwd() + "/src/assets/uploads/product/" + image[i].name
                fs.writeFileSync(filename,image[i].data)
            }  
    }) 
    imageDB()
    fs.mkdirSync(dirProduct, { recursive: true })
}

const dirZipFile = process.cwd() + '/src/assets/downloads'
        if (!fs.existsSync(dirZipFile)) {
            fs.mkdirSync(dirZipFile, { recursive: true })
        }
const uploadFileUser = multer({ storage: storageUser, fileFilter: imageFilterUser });

module.exports = { uploadFileProd, uploadFileUser }