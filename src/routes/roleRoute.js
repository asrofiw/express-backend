const { Router } = require('express')
const { createRole, getAllRole, updateRole, deleteRole } = require('../controllers/roleController')

const router = Router()

router.post('/', createRole)
router.get('/', getAllRole)
router.patch('/:id', updateRole)
router.delete('/:id', deleteRole)

module.exports = router
