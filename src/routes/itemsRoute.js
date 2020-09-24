const { Router } = require('express')
const { createItem, getDetailItem, updateItem, updatePartialItem, deleteItem, getItems } = require('../controllers/itemsController')

const router = Router()

const uploadHelper = require('../helpers/upload')

router.post('/', uploadHelper.single('picture'), createItem)
router.get('/:id', getDetailItem)
router.put('/:id', uploadHelper.single('picture'), updateItem)
router.patch('/:id', uploadHelper.single('picture'), updatePartialItem)
router.delete('/:id', deleteItem)
router.get('/', getItems)

module.exports = router
