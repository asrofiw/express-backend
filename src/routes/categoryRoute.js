const { Router } = require('express')
const { createCategory, updateCategory, getAllCategory, deleteCategory, getDetailCategory } = require('../controllers/categoryController')

const router = Router()

// manage by admin
router.post('/category', createCategory)
router.put('/category/:id', updateCategory)
router.delete('/category/:id', deleteCategory)

// get by all customer
router.get('/user/category/:id', getDetailCategory)
router.get('/user/category', getAllCategory)

module.exports = router
