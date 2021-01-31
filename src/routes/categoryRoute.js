const { Router } = require('express')
const { createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')

const router = Router()

// manage by seller
router.post('/category', createCategory)
router.put('/category/:id', updateCategory)
router.delete('/category/:id', deleteCategory)

module.exports = router
