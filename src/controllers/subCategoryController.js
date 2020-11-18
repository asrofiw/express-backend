const { APP_URL } = process.env
const qs = require('querystring')
const response = require('../helpers/response')
const { createSubCategoryModel, getAllSubCategoryModel, updateSubCategoryModel, deleteSubCategoryModel, getCountAllSubCategoryModel, getDetailSubCategoryIDModel, getDetailSubCategoryModel, getCountSubCategoryModel } = require('../models/subCategoryModel')

module.exports = {
  createSubCategory: async (req, res) => {
    const { name, categoryID } = req.body
    try {
      const result = await createSubCategoryModel([name, categoryID])
      if (result.affectedRows) {
        return response(res, 'Sub Category has been created', 200, true, { data: req.body })
      } else {
        return response(res, 'Failed to create Sub Category', 400, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  },
  getAllSubCategory: async (req, res) => {
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
    try {
      const result = await getAllSubCategoryModel([limit, offset])
      const pageInfo = {
        count: 0,
        pages: 0,
        currentPage: page,
        limitPerPage: limit,
        nextLink: null,
        prevLink: null
      }
      if (result.length) {
        try {
          const data = await getCountAllSubCategoryModel(page)
          const { count } = data[0]
          pageInfo.count = count
          pageInfo.pages = Math.ceil(count / limit)

          const { pages, currentPage } = pageInfo

          if (currentPage < pages) {
            pageInfo.nextLink = `${APP_URL}/public/sub-category?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
          }

          if (currentPage > 1) {
            pageInfo.prevLink = `${APP_URL}/public/sub-category?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
          }
          return response(res, 'List of Sub Category', 200, true, { data: result, pageInfo })
        } catch (err) {
          return response(res, 'Internal server error', 500, false)
        }
      } else {
        return response(res, 'Sub Category not found', 400, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  },
  updateSubCategory: async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    try {
      const result = await updateSubCategoryModel([id, name])
      if (result.affectedRows) {
        return response(res, `Sub Category with id ${id} has been updated`)
      } else {
        return response(res, 'Failed to update Sub Category', 400, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  },
  deleteSubCategory: async (req, res) => {
    const { id } = req.params
    try {
      const data = await getDetailSubCategoryIDModel(id)
      if (data.length) {
        try {
          const result = await deleteSubCategoryModel(id)
          if (result.affectedRows) {
            return response(res, `Sub Category with id ${id} has been deleted`)
          } else {
            return response(res, 'Sub Category cannot be deleted', 400, false)
          }
        } catch (err) {
          return response(res, 'Internal server error', 500, false)
        }
      } else {
        return response(res, 'Sub Category not found', 404, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  },
  getDetailSubCategory: async (req, res) => {
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
    try {
      const result = await getDetailSubCategoryModel([id, limit, offset])
      const pageInfo = {
        count: 0,
        pages: 0,
        currentPage: page,
        limitPerPage: limit,
        nextLink: null,
        prevLink: null,
        numberOfData: result.length
      }
      if (result.length) {
        const name = result[0].sub_category_name
        try {
          const data = await getCountSubCategoryModel([id, name])
          const { count } = data[1]
          pageInfo.count = count
          pageInfo.pages = Math.ceil(count / limit)

          const { pages, currentPage } = pageInfo

          if (currentPage < pages) {
            pageInfo.nextLink = `${APP_URL}/public/sub-category/${id}?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
          }

          if (currentPage > 1) {
            pageInfo.prevLink = `${APP_URL}/public/sub-category/${id}?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
          }
          return response(res, `List of Sub Category ${name}`, 200, true, { data: result, pageInfo })
        } catch (err) {
          return response(res, 'Internal server error', 500, false)
        }
      } else {
        return response(res, `There is no data on list of Sub Category with id ${id}`, 400, false, { pageInfo })
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  }
}
