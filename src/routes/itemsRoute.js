const { Router } = require('express')
const { createItem, getDetailItem, updateItem, updatePartialItem, deleteItem, getItems } = require('../controllers/itemsController')

const router = Router()

const uploadHelper = require('../helpers/upload')

// Manage items by User Seller
router.put('/user/seller/items/:id', uploadHelper.array('pictures', 5), updateItem)
router.patch('/user/seller/items/:id', uploadHelper.array('pictures', 5), updatePartialItem)
router.delete('user/seller/items/:id', deleteItem)
router.post('/user/seller/items', uploadHelper.array('pictures', 5), createItem)

// get Items by all user
router.get('/items/:id', getDetailItem)
router.get('/items', getItems)

module.exports = router
