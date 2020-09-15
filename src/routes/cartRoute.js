const { Router } = require('express')
const { createCart, updateAmountCart, deleteCart, getCart } = require('../controllers/cartController')

const router = Router()

router.post('/', createCart)
router.patch('/:id', updateAmountCart)
router.delete('/:id', deleteCart)
router.get('/', getCart)

module.exports = router
