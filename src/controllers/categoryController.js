const qs = require('querystring')
const { createCategoryModel, updateCategoryModel, getAllCategoryModel, deleteCategoryModel, getDetailCategoryModel, getCountCategoryModel, getDetailCategoryIDModel } = require('../models/categoryModel')

module.exports = {
  createCategory: (req, res) => {
    const { name } = req.body
    if (name) {
      createCategoryModel(name, (err, result) => {
        if (!err) {
          res.status(201).send({
            succes: true,
            message: 'Item has been created',
            data: {
              id: result.insertId,
              ...req.body
            }
          })
        } else {
          res.send({
            succes: false,
            message: 'Error Database'
          })
        }
      })
    } else {
      res.status(400).send({
        succes: false,
        message: 'All field must be filled'
      })
    }
  },
  getAllCategory: (_req, res) => {
    getAllCategoryModel((err, result) => {
      if (!err) {
        if (result.length) {
          res.send({
            succes: true,
            message: 'List of Category',
            data: result,
            numberOfCategory: result.length
          })
        } else {
          res.send({
            succes: false,
            message: 'Data not found!'
          })
        }
      } else {
        res.send({
          succes: false,
          message: 'Error Database'
        })
      }
    })
  },
  updateCategory: (req, res) => {
    const { id } = req.params
    const { name } = req.body

    updateCategoryModel([id, name], (err, result) => {
      if (!err) {
        if (result.affectedRows) {
          res.send({
            succes: true,
            message: `Category with id ${id} has been updated`,
            value: req.body
          })
        } else {
          res.send({
            succes: false,
            message: 'Failed update category'
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
  deleteCategory: (req, res) => {
    const { id } = req.params
    getDetailCategoryIDModel(id, (_err, result) => {
      console.log(result)
      if (result.length) {
        deleteCategoryModel(id, (err, item) => {
          if (!err) {
            if (item.affectedRows) {
              res.send({
                succes: true,
                message: `Category with id ${id} has been deleted`
              })
            } else {
              res.send({
                succes: false,
                message: 'Category can not be deleted'
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
            console.log(data)
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
            res.send({
              succes: true,
              message: `List of Category ${result[0].category_name}`,
              data: result,
              pageInfo
            })
          })
        } else {
          res.send({
            succes: false,
            message: `There is no data on list of Category with id ${id}`,
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
