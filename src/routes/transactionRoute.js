const { createTransaction, getTransaction, getDetailTransaction } = require('../controllers/transactionController')
const auth = require('../middlewares/auth')

const router = require('express').Router()

router.post('/customer/transaction', auth, createTransaction)
router.get('/customer/transaction', auth, getTransaction)
router.get('/customer/transaction/:id', auth, getDetailTransaction)

module.exports = router
