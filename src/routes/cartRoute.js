const { Router } = require('express')
const { createCart, updateQuantityCart, deleteCart, getCart } = require('../controllers/cartController')

const router = Router()

router.post('/customer/cart', createCart)
router.patch('/customer/cart/:id', updateQuantityCart)
router.delete('/customer/cart/:id', deleteCart)
router.get('/customer/cart', getCart)

module.exports = router
