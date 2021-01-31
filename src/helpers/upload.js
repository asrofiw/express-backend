const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!file) {
      return cb(new Error("Image can't be null"), false)
    }
    cb(null, 'assets/uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.')[file.originalname.split('.').length - 1]
    const fileName = new Date().getTime().toString().concat('.').concat(ext)
    cb(null, fileName)
  }
})

const fileFilter = (req, file, cb) => {
  const mime = ['image/jpeg', 'image/jpg', 'image/png', 'image/PNG']
  if (mime.includes(file.mimetype)) {
    return cb(null, true)
  }
  return cb(new Error('Only image files are allowed'), false)
}

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2000000 }
})
