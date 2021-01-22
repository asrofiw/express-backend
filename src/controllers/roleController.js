const response = require('../helpers/response')
const { createRoleModel, getAllRoleModel, getRoleIdModel, updateRoleModel, deleteRoleModel } = require('../models/roleModel')

module.exports = {
  createRole: async (req, res) => {
    try {
      const { name, description } = req.body
      if (name && description) {
        const result = await createRoleModel([name, description])
        if (result.affectedRows) {
          const data = {
            id: result.insertId,
            ...req.body
          }

          return response(res, 'Role has been created', 200, true, { data })
        }
      } else {
        return response(res, 'Fill all column', 400, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  },

  getAllRole: async (_req, res) => {
    try {
      const result = await getAllRoleModel()
      if (result.length) {
        const data = result.map(element => {
          return {
            id: element.id,
            name: element.name,
            description: element.description
          }
        })

        return response(res, 'List of Role', 200, true, { data })
      } else {
        return response(res, 'Failed to get List of Role', 400, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  },

  updateRole: async (req, res) => {
    try {
      const { id } = req.params
      const { name = '', description = '' } = req.body
      if (name.trim() || description.trim()) {
        const item = await getRoleIdModel(id)
        if (item.length) {
          const data = Object.entries(req.body).map(element => {
            return `${element[0]} = '${element[1]}'`
          })
          const result = await updateRoleModel([data, id])
          if (result.affectedRows) {
            return response(res, `Role with id ${id} has been update`)
          } else {
            return response(res, 'Failed to update Role', 400, false)
          }
        } else {
          return response(res, 'Failed to get Role', 404, false)
        }
      } else {
        return response(res, 'At least one column is filled', 400, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  },

  deleteRole: async (req, res) => {
    try {
      const { id } = req.params
      const item = await getRoleIdModel(id)
      if (item.length) {
        try {
          const result = await deleteRoleModel(id)
          if (result.affectedRows) {
            return response(res, `Role with id ${id} has been deleted`)
          } else {
            return response(res, 'Failed to delete Role', 400, false)
          }
        } catch (err) {
          return response(res, 'Internal server error', 500, false)
        }
      } else {
        return response(res, `Role with id ${id} not found`, 404, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  }
}
