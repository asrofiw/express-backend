const { Router } = require('express')
const {
  createUser,
  getUser,
  getDetailUser,
  updateUserAccess,
  updateUserDetail,
  deleteUser,
  createUserAddress,
  updateUserAddress
} = require('../controllers/userController')

const router = Router()
const uploadHelper = require('../helpers/upload')
const authMiddleware = require('../middlewares/auth')

router.post('/register', uploadHelper.single('picture'), createUser)
router.get('/', authMiddleware, getUser)
router.get('/:id', authMiddleware, getDetailUser)
router.patch('/:id', authMiddleware, updateUserAccess)
router.patch('/detail/:id', authMiddleware, uploadHelper.single('picture'), updateUserDetail)
router.delete('/detail/:id', authMiddleware, deleteUser)
router.post('/shipping-address', authMiddleware, createUserAddress)
router.patch('/shipping-address/:id', authMiddleware, updateUserAddress)

module.exports = router
