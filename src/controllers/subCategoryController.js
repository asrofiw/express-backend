const pagination = require('../helpers/pagination')
const response = require('../helpers/response')
const {
  createSubCategoryModel,
  getAllSubCategoryModel,
  updateSubCategoryModel,
  deleteSubCategoryModel,
  getCountAllSubCategoryModel,
  getDetailSubCategoryIDModel,
  getDetailSubCategoryModel,
  getCountSubCategoryModel
} = require('../models/subCategoryModel')

module.exports = {
  createSubCategory: async (req, res) => {
    try {
      const roleId = req.user.role_id
      if (roleId === 2) {
        const { name, categoryID } = req.body
        const result = await createSubCategoryModel([name, categoryID])
        if (result.affectedRows) {
          return response(res, 'Sub Category has been created', 200, true, { data: req.body })
        } else {
          return response(res, 'Failed to create Sub Category', 400, false)
        }
      } else {
        return response(res, 'Forbidden access', 401, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false, { error: err.message })
    }
  },

  getAllSubCategory: async (req, res) => {
    try {
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
      const result = await getAllSubCategoryModel([limit, offset])
      if (result.length) {
        const data = await getCountAllSubCategoryModel(page)
        const { count } = data[0]
        const pageInfo = pagination(req, count, '', 'sub-category')

        return response(res, 'List of Sub Category', 200, true, { data: result, pageInfo })
      } else {
        return response(res, 'Sub Category not found', 400, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false, { error: err.message })
    }
  },

  updateSubCategory: async (req, res) => {
    try {
      const roleId = req.user.role_id
      if (roleId === 2) {
        const { id } = req.params
        const { name } = req.body

        const result = await updateSubCategoryModel([id, name])
        if (result.affectedRows) {
          return response(res, `Sub Category with id ${id} has been updated`, 200, true, req.body)
        } else {
          return response(res, 'Failed to update Sub Category', 400, false)
        }
      } else {
        return response(res, 'Forbidden access', 401, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false, { error: err.message })
    }
  },

  deleteSubCategory: async (req, res) => {
    try {
      const roleId = req.user.role_id
      if (roleId === 2) {
        const { id } = req.params
        const data = await getDetailSubCategoryIDModel(id)
        if (data.length) {
          const result = await deleteSubCategoryModel(id)
          if (result.affectedRows) {
            return response(res, `Sub Category with id ${id} has been deleted`)
          } else {
            return response(res, 'Sub Category cannot be deleted', 400, false)
          }
        } else {
          return response(res, 'Sub Category not found', 404, false)
        }
      } else {
        return response(res, 'Forbidden access', 401, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false, { error: err.message })
    }
  },

  getDetailSubCategory: async (req, res) => {
    try {
      const { id } = req.params
      let { page, limit } = req.query

      if (!limit) {
        limit = 3
      } else {
        limit = parseInt(limit)
      }

      if (!page) {
        page = 1
      } else {
        page = parseInt(page)
      }
      const offset = (page - 1) * limit
      const result = await getDetailSubCategoryModel([id, limit, offset])
      if (result.length) {
        const name = result[0].sub_category_name
        const data = await getCountSubCategoryModel([id, name])
        const { count } = data[0]
        const pageInfo = pagination(req, count, id, 'sub-category')

        return response(res, `List of Sub Category ${name}`, 200, true, { data: result, pageInfo })
      } else {
        return response(res, `There is no data on list of Sub Category with id ${id}`, 400, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false, { error: err.message })
    }
  }
}
