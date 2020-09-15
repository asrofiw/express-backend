const { Router } = require('express')
const { createSubCategory, getAllSubCategory, updateSubCategory, deleteSubCategory, getDetailSubCategory } = require('../controllers/subCategoryController')

const router = Router()

router.post('/', createSubCategory)
router.get('/', getAllSubCategory)
router.put('/:id', updateSubCategory)
router.delete('/:id', deleteSubCategory)
router.get('/:id', getDetailSubCategory)

module.exports = router
