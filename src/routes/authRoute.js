const router = require('express').Router()
const { loginController, createUserCustomer, createUserSeller } = require('../controllers/authController')

router.post('/register/customer', createUserCustomer)
router.post('/register/seller', createUserSeller)
router.post('/login', loginController)

module.exports = router
