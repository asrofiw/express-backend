const { Router } = require('express')
const { createItem, getDetailItem, updateItem, updatePartialItem, deleteItem, getItems } = require('../controllers/itemsController')

const router = Router()

const uploadHelper = require('../helpers/upload')

router.post('/', uploadHelper.array('pictures', 5), createItem)
router.get('/:id', getDetailItem)
router.put('/:id', uploadHelper.array('pictures', 5), updateItem)
router.patch('/:id', uploadHelper.array('pictures', 5), updatePartialItem)
router.delete('/:id', deleteItem)
router.get('/', getItems)

module.exports = router
