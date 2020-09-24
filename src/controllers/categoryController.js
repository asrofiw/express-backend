const qs = require('querystring')
const responseStandard = require('../helpers/response')
const { createCategoryModel, updateCategoryModel, getAllCategoryModel, deleteCategoryModel, getDetailCategoryModel, getCountCategoryModel, getDetailCategoryIDModel } = require('../models/categoryModel')

module.exports = {
  createCategory: (req, res) => {
    const { name } = req.body
    if (name) {
      createCategoryModel(name, (err, result) => {
        if (!err) {
          const data = {
            id: result.insertId,
            ...req.body
          }

          return responseStandard(res, 'Category has been added', 200, true, { data })
        } else {
          return responseStandard(res, 'Internal server error', 500, false)
        }
      })
    } else {
      return responseStandard(res, 'All field must be filled', 400, false)
    }
  },
  getAllCategory: (_req, res) => {
    getAllCategoryModel((err, result) => {
      if (!err) {
        if (result.length) {
          return responseStandard(res, 'List of Category', 200, true, { data: result, numberOfCategory: result.length })
        } else {
          return responseStandard(res, 'Data not found', 400, false)
        }
      } else {
        return responseStandard(res, 'Internal server error', 500, false)
      }
    })
  },
  updateCategory: (req, res) => {
    const { id } = req.params
    const { name } = req.body

    updateCategoryModel([id, name], (err, result) => {
      if (!err) {
        if (result.affectedRows) {
          return responseStandard(res, `Category with id ${id} updated`)
        } else {
          return responseStandard(res, 'Failed to update Category', 400, false)
        }
      } else {
        return responseStandard(res, 'Internal server error', 500, false)
      }
    })
  },
  deleteCategory: (req, res) => {
    const { id } = req.params
    getDetailCategoryIDModel(id, (err1, result1) => {
      if (!err1) {
        if (result1.length) {
          deleteCategoryModel(id, (err2, result2) => {
            if (!err2) {
              if (result2.affectedRows) {
                return responseStandard(res, `Category with id ${id} has been deleted`)
              } else {
                return responseStandard(res, 'Cannot delete Category', 400, false)
              }
            } else {
              return responseStandard(res, 'Internal server error', 500, false)
            }
          })
        } else {
          return responseStandard(res, `Cannot get detail Category with id ${id}`, 400, false)
        }
      } else {
        return responseStandard(res, 'Internal server erro', 500, false)
      }
    })
  },
  getDetailCategory: (req, res) => {
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
    getDetailCategoryModel([id, limit, offset], (err, result) => {
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
          getCountCategoryModel(id, (_err, data) => {
            const { count } = data[0]
            pageInfo.count = count
            pageInfo.pages = Math.ceil(count / limit)

            const { pages, currentPage } = pageInfo

            if (currentPage < pages) {
              pageInfo.nextLink = `http://localhost:8080/category/${id}?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
            }

            if (currentPage > 1) {
              pageInfo.prevLink = `http://localhost:8080/category/${id}?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
            }
            return responseStandard(res, `List of Category ${result[0].category_name}`, 200, true, { data: result, pageInfo })
          })
        } else {
          return responseStandard(res, `There is no data on List of Category with id ${id}`, 400, false, { pageInfo })
        }
      } else {
        return responseStandard(res, 'Internal server error', 500, false)
      }
    })
  }
}
