const { Router } = require('express')
const { createItem, getDetailItem, updateItem, updatePartialItem, deleteItem, getItems } = require('../controllers/itemsController')

const router = Router()

router.post('/', createItem)
router.get('/:id', getDetailItem)
router.put('/:id', updateItem)
router.patch('/:id', updatePartialItem)
router.delete('/:id', deleteItem)
router.get('/', getItems)

module.exports = router
