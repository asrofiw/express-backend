const { Router } = require('express')
const { createSubCategory, getAllSubCategory, updateSubCategory, deleteSubCategory, getDetailSubCategory } = require('../controllers/subCategoryController')
const upload = require('../helpers/upload')

const router = Router()

router.post('/', upload.single('picture'), createSubCategory)
router.put('/:id', updateSubCategory)
router.delete('/:id', deleteSubCategory)

// get category by all users
router.get('/sub-category', getAllSubCategory)
router.get('/sub-category/:id', getDetailSubCategory)

module.exports = router
