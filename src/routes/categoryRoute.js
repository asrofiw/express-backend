const { Router } = require('express')
const { createCategory, updateCategory, getAllCategory, deleteCategory, getDetailCategory } = require('../controllers/categoryController')

const router = Router()

router.post('/', createCategory)
router.get('/', getAllCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)
router.get('/:id', getDetailCategory)

module.exports = router
