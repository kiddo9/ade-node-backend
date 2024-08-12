const multer = require('multer')
const Storage = multer.memoryStorage();

const Upload = multer({
    storage: Storage
});

module.exports = Upload;