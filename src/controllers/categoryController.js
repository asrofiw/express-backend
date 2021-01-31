const responseStandard = require('../helpers/response')
const pagination = require('../helpers/pagination')
const {
  createCategoryModel,
  updateCategoryModel,
  getAllCategoryModel,
  deleteCategoryModel,
  getDetailCategoryModel,
  getCountCategoryModel,
  getDetailCategoryIDModel
} = require('../models/categoryModel')

module.exports = {
  createCategory: async (req, res) => {
    try {
      const roleId = req.user.role_id
      if (roleId === 2) {
        const { name } = req.body
        if (name) {
          const result = await createCategoryModel(name)
          const data = {
            id: result.insertId,
            ...req.body
          }

          return responseStandard(res, 'Category has been added', 200, true, { data })
        } else {
          return responseStandard(res, 'All field must be filled', 400, false)
        }
      } else {
        return responseStandard(res, 'Forbidden access', 401, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal server error', 500, false, { error: err.message })
    }
  },

  getAllCategory: async (_req, res) => {
    try {
      const result = await getAllCategoryModel()
      if (result.length) {
        return responseStandard(res, 'List of Category', 200, true, { data: result, numberOfCategory: result.length })
      } else {
        return responseStandard(res, 'Data not found', 400, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal server error', 500, false, { error: err.message })
    }
  },

  updateCategory: async (req, res) => {
    try {
      const roleId = req.user.role_id
      if (roleId === 2) {
        const { id } = req.params
        const { name } = req.body

        const result = await updateCategoryModel([id, name])
        if (result.affectedRows) {
          return responseStandard(res, 'Category updated')
        } else {
          return responseStandard(res, 'Failed to update Category', 400, false)
        }
      } else {
        return responseStandard(res, 'Forbidden access', 401, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal server error', 500, false, { error: err.message })
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const roleId = req.user.role_id
      if (roleId === 2) {
        const { id } = req.params
        const result = await getDetailCategoryIDModel(id)
        if (result.length) {
          const result = await deleteCategoryModel(id)
          if (result.affectedRows) {
            return responseStandard(res, 'Category has been deleted')
          } else {
            return responseStandard(res, 'Cannot delete Category', 400, false)
          }
        } else {
          return responseStandard(res, 'Category not found', 404, false)
        }
      } else {
        return responseStandard(res, 'Forbidden access', 401, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal server erro', 500, false, { error: err.message })
    }
  },

  getDetailCategory: async (req, res) => {
    try {
      const { id } = req.params
      let { page, limit } = req.query

      if (!limit) {
        limit = 5
      } else {
        limit = parseInt(limit)
      }

      if (!page) {
        page = 1
      } else {
        page = parseInt(page)
      }
      const offset = (page - 1) * limit
      const result = await getDetailCategoryModel([id, limit, offset])
      if (result.length) {
        const data = await getCountCategoryModel(id)
        const { count } = data[0]
        const pageInfo = pagination(req, count, id, 'category')
        return responseStandard(res, `List of Category ${result[0].name}`, 200, true, { data: result, pageInfo })
      } else {
        return responseStandard(res, `There is no data on List of Category with id ${id}`, 404, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal server error', 500, false, { error: err.message })
    }
  }
}
