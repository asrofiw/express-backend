const { Router } = require('express')
const { createItem, updatePartialItem, deleteItem } = require('../controllers/itemsController')

const router = Router()

// Manage items by Seller
router.post('/seller/items', createItem)
router.patch('/seller/items/:idItem', updatePartialItem)
router.delete('/seller/items/:idItem', deleteItem)

module.exports = router
