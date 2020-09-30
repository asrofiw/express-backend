const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.')[file.originalname.split('.').length - 1]
    const fileName = new Date().getTime().toString().concat('.').concat(ext)
    cb(null, fileName)
  }
})

module.exports = multer({
  storage: storage
})
