const router = require('express').Router()
const { loginController } = require('../controllers/authController')

router.post('/login', loginController)

module.exports = router
