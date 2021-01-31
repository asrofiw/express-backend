const router = require('express').Router()
const { getAllCategory, getDetailCategory } = require('../controllers/categoryController')
const { getItems, getDetailItem } = require('../controllers/itemsController')
const { getAllSubCategory, getDetailSubCategory } = require('../controllers/subCategoryController')

// public category
router.get('/category', getAllCategory)
router.get('/category/:id', getDetailCategory)

// public sub-category
router.get('/sub-category', getAllSubCategory)
router.get('/sub-category/:id', getDetailSubCategory)

// public items
router.get('/items', getItems)
router.get('/items/:id', getDetailItem)

module.exports = router
