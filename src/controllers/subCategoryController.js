const qs = require('querystring')
const { createSubCategoryModel, getAllSubCategoryModel, updateSubCategoryModel, deleteSubCategoryModel, getCountAllSubCategoryModel, getDetailSubCategoryIDModel, getDetailSubCategoryModel, getCountSubCategoryModel } = require('../models/subCategoryModel')

module.exports = {
  createSubCategory: (req, res) => {
    const { name, categoryID } = req.body
    createSubCategoryModel([name, categoryID], (err, result) => {
      if (!err) {
        if (result.affectedRows) {
          res.send({
            succes: true,
            message: 'Sub Category has been created',
            data: req.body
          })
        } else {
          res.send({
            succes: false,
            message: 'Failed to create Sub Category'
          })
        }
      } else {
        res.send({
          succes: false,
          message: 'Database error'
        })
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
            res.send({
              succes: true,
              message: 'List of Sub Category',
              data: result,
              pageInfo
            })
          })
        } else {
          res.send({
            succes: false,
            message: 'Sub Category not found'
          })
        }
      } else {
        res.send({
          succes: false,
          message: 'Database Error'
        })
      }
    })
  },
  updateSubCategory: (req, res) => {
    const { id } = req.params
    const { name } = req.body

    updateSubCategoryModel([id, name], (err, result) => {
      if (!err) {
        if (result.affectedRows) {
          res.send({
            succes: true,
            message: `Sub Category with id ${id} has been updated`,
            value: req.body
          })
        } else {
          res.send({
            succes: false,
            message: 'Failed update Sub Category'
          })
        }
      } else {
        res.send({
          succes: false,
          message: 'Database update error'
        })
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
              res.send({
                succes: true,
                message: `Sub Category with id ${id} has been deleted`
              })
            } else {
              res.send({
                succes: false,
                message: 'Sub Category can not be deleted'
              })
            }
          } else {
            res.send({
              succes: false,
              message: 'Database error'
            })
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
            res.send({
              succes: true,
              message: `List of Sub Category ${name}`,
              data: result,
              pageInfo
            })
          })
        } else {
          res.send({
            succes: false,
            message: `There is no data on list of Sub Category with id ${id}`,
            pageInfo
          })
        }
      } else {
        res.send({
          succes: false,
          message: 'Database Error'
        })
      }
    })
  }
}
