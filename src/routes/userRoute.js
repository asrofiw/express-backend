const { Router } = require('express')
const {
  getUser,
  updateUserAccess,
  updateUserDetail,
  deleteUser,
  createCustomerAddress,
  updateCustomerAddress,
  getCustomerAddress,
  updateUserSeller,
  getCustomerDetail,
  getSellerDetail,
  createUserBalance,
  topUpBalance,
  getBalance
} = require('../controllers/userController')

const router = Router()
const uploadHelper = require('../helpers/upload')
const authMiddleware = require('../middlewares/auth')

// Customer profile
router.get('/customer/profile', authMiddleware, getCustomerDetail)
router.patch('/customer/profile', authMiddleware, updateUserDetail)
// Customer Shipping-Address
router.get('/customer/shipping-address', authMiddleware, getCustomerAddress)
router.post('/customer/shipping-address', authMiddleware, createCustomerAddress)
router.patch('/customer/shipping-address/:id', authMiddleware, updateCustomerAddress)
// Customer Balance
router.post('/customer/balance', authMiddleware, createUserBalance)
router.patch('/customer/balance', authMiddleware, topUpBalance)
router.get('/customer/balance', authMiddleware, getBalance)

// Seller profile
router.get('/seller/profile', authMiddleware, getSellerDetail)
router.patch('/seller/profile', authMiddleware, uploadHelper.single('picture'), updateUserSeller)

router.get('/', authMiddleware, getUser)
router.patch('/:id', authMiddleware, updateUserAccess)
router.delete('/detail/:id', authMiddleware, deleteUser)

module.exports = router
