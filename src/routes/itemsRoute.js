const { Router } = require('express')
const { createItem, getDetailItem, updateItem, updatePartialItem, deleteItem, getItems } = require('../controllers/itemsController')

const router = Router()

const uploadHelper = require('../helpers/upload')

// Manage items by Seller
router.put('/seller/items/:id', uploadHelper.array('pictures', 5), updateItem)
router.patch('/seller/items/:id', uploadHelper.array('pictures', 5), updatePartialItem)
router.delete('/seller/items/:id', deleteItem)
router.post('/seller/items', uploadHelper.array('pictures', 5), createItem)
router.get('/seller/items/:id', getDetailItem)
router.get('/seller/items', getItems)

// get Items by all user
router.get('/items/:id', getDetailItem)
router.get('/items', getItems)

module.exports = router
