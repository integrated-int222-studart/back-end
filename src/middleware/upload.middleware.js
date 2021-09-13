const multer = require("multer");

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.cwd() + "/src/assets/uploads/product/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const uploadFileProd = multer({ storage: storage, fileFilter: imageFilter });

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
        cb(null, file.originalname);
    },
});

const uploadFileUser= multer({ storage: storageUser, fileFilter: imageFilterUser });

module.exports = {uploadFileProd, uploadFileUser}