const { Router } = require('express')
const { createItem, getDetailItem, updateItem, updatePartialItem, deleteItem, getItems } = require('../controllers/itemsController')

const router = Router()

const uploadHelper = require('../helpers/upload')

router.post('/items', uploadHelper.array('pictures'), createItem)
router.get('/items/:id', getDetailItem)
router.put('/items/:id', uploadHelper.array('pictures'), updateItem)
router.patch('/items/:id', uploadHelper.array('pictures'), updatePartialItem)
router.delete('/items/:id', deleteItem)
router.get('/items', getItems)

module.exports = router
