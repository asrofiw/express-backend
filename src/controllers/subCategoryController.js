const qs = require('querystring')
const responseStandard = require('../helpers/response')
const { createSubCategoryModel, getAllSubCategoryModel, updateSubCategoryModel, deleteSubCategoryModel, getCountAllSubCategoryModel, getDetailSubCategoryIDModel, getDetailSubCategoryModel, getCountSubCategoryModel } = require('../models/subCategoryModel')

module.exports = {
  createSubCategory: (req, res) => {
    const { name, categoryID } = req.body
    createSubCategoryModel([name, categoryID], (err, result) => {
      if (!err) {
        if (result.affectedRows) {
          return responseStandard(res, 'Sub Category has been created', 200, true, { data: req.body })
        } else {
          return responseStandard(res, 'Failed to create Sub Category', 400, false)
        }
      } else {
        return responseStandard(res, 'Internal server error', 500, false)
      }
    })
  },
  getAllSubCategory: (req, res) => {
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
    getAllSubCategoryModel([limit, offset], (err, result) => {
      if (!err) {
        const pageInfo = {
          count: 0,
          pages: 0,
          currentPage: page,
          limitPerPage: limit,
          nextLink: null,
          prevLink: null
        }
        if (result.length) {
          getCountAllSubCategoryModel(page, (_err, data) => {
            console.log(data)
            const { count } = data[0]
            pageInfo.count = count
            pageInfo.pages = Math.ceil(count / limit)

            const { pages, currentPage } = pageInfo

            if (currentPage < pages) {
              pageInfo.nextLink = `http://localhost:8080/sub-category?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
            }

            if (currentPage > 1) {
              pageInfo.prevLink = `http://localhost:8080/sub-category?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
            }
            return responseStandard(res, 'List of Sub Category', 200, true, { data: result, pageInfo })
          })
        } else {
          return responseStandard(res, 'Sub Category not found', 400, false)
        }
      } else {
        return responseStandard(res, 'Internal server error', 500, false)
      }
    })
  },
  updateSubCategory: (req, res) => {
    const { id } = req.params
    const { name } = req.body

    updateSubCategoryModel([id, name], (err, result) => {
      if (!err) {
        if (result.affectedRows) {
          return responseStandard(res, `Sub Category with id ${id} has been updated`)
        } else {
          return responseStandard(res, 'Failed to update Sub Category', 400, false)
        }
      } else {
        return responseStandard(res, 'Internal server error', 500, false)
      }
    })
  },
  deleteSubCategory: (req, res) => {
    const { id } = req.params
    getDetailSubCategoryIDModel(id, (_err, result) => {
      if (result.length) {
        deleteSubCategoryModel(id, (err, result) => {
          if (!err) {
            if (result.affectedRows) {
              return responseStandard(res, `Sub Category with id ${id} has been deleted`)
            } else {
              return responseStandard(res, 'Sub Category cannot be deleted', 400, false)
            }
          } else {
            return responseStandard(res, 'Internal server error', 500, false)
          }
        })
      }
    })
  },
  getDetailSubCategory: (req, res) => {
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
    getDetailSubCategoryModel([id, limit, offset], (err, result) => {
      if (!err) {
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
          getCountSubCategoryModel([id, name], (_error, data) => {
            const { count } = data[1]
            pageInfo.count = count
            pageInfo.pages = Math.ceil(count / limit)

            const { pages, currentPage } = pageInfo

            if (currentPage < pages) {
              pageInfo.nextLink = `http://localhost:8080/sub-category/${id}?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
            }

            if (currentPage > 1) {
              pageInfo.prevLink = `http://localhost:8080/sub-category/${id}?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
            }
            return responseStandard(res, `List of Sub Category ${name}`, 200, true, { data: result, pageInfo })
          })
        } else {
          return responseStandard(res, `There is no data on list of Sub Category with id ${id}`, 400, false, { pageInfo })
        }
      } else {
        return responseStandard(res, 'Internal server error', 500, false)
      }
    })
  }
}
