const { Router } = require('express')
const {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory
} = require('../controllers/subCategoryController')

const router = Router()

// manage sub-category by seller
router.post('/sub-category', createSubCategory)
router.put('/sub-category/:id', updateSubCategory)
router.delete('/sub-category/:id', deleteSubCategory)

module.exports = router
