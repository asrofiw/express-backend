const router = require('express').Router()
const { getAllCategory, getDetailCategory } = require('../controllers/categoryController')
const { getItems, getDetailItem } = require('../controllers/itemsController')
const { getAllSubCategory, getDetailSubCategory } = require('../controllers/subCategoryController')

router.get('/category', getAllCategory)
router.get('/category/:id', getDetailCategory)
router.get('/items', getItems)
router.get('/items/:id', getDetailItem)
router.get('/sub-category', getAllSubCategory)
router.get('/sub-category/:id', getDetailSubCategory)

module.exports = router
