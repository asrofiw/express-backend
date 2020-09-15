const qs = require('querystring')

const { createItemModel, getDetailItemModel, getDetailItemIDModel, updateItemModel, updatePartialItemModel, deleteItemModel, getItemModel, getItemCountModel } = require('../models/itemsModel')

module.exports = {
  createItem: (req, res) => {
    const { name, price, description, categoryID, subCategoryID } = req.body
    if (name && price && description && categoryID && subCategoryID) {
      createItemModel([name, price, description, categoryID, subCategoryID], (err, result) => {
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
            message: 'Database Error'
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
  getDetailItem: (req, res) => {
    const { id } = req.params
    getDetailItemModel(id, (err, item) => {
      if (!err) {
        if (item.length) {
          res.send({
            succes: true,
            message: `Item with id ${id}`,
            data: item[0],
            back: 'http://localhost:8080/items'
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
          message: 'Database Error'
        })
      }
    })
  },
  updateItem: (req, res) => {
    const { id } = req.params
    const { name, price, description, categoryID, subCategoryID } = req.body
    if (name.trim() && price.trim() && description.trim() && categoryID.trim() && subCategoryID.trim()) {
      getDetailItemIDModel(id, (_err, items) => {
        // if (Object.values(items).includes("'")) {
        //   x[index].
        //   return Object.values(items).replace()

        //     })
        //   console.log(data)
        // }
        if (items.length) {
          updateItemModel([id, name, price, description, categoryID, subCategoryID], result => {
            if (result.affectedRows) {
              res.send({
                succes: true,
                message: `Category with id ${id} has been updated`
              })
            } else {
              res.send({
                succes: false,
                message: 'Failed update data'
              })
            }
          })
        } else {
          res.send({
            succes: false,
            message: `ID ${id} not found`
          })
        }
      })
    } else {
      res.send({
        succes: false,
        message: 'Error'
      })
    }
  },
  updatePartialItem: (req, res) => {
    const { id } = req.params
    const { name = '', price = '', description = '', categoryID = '', subCategoryID = '' } = req.body
    if (name.trim() || price.trim() || description.trim() || categoryID.trim() || subCategoryID.trim()) {
      getDetailItemIDModel(id, (_err, item) => {
        if (item.length) {
          const data = Object.entries(req.body).map(element => {
            return parseInt(element[1]) > 0 ? `${element[0]} = ${element[1]}` : `${element[0]} = '${element[1]}'`
          })
          updatePartialItemModel([id, data], (_err, result) => {
            if (result.affectedRows) {
              res.send({
                succes: true,
                message: `item ${id} has been updated`
              })
            } else {
              res.send({
                succes: false,
                message: 'Failed to update data'
              })
            }
          })
        } else {
          res.send({
            succes: false,
            message: 'At least one column is filled'
          })
        }
      })
    }
  },
  deleteItem: (req, res) => {
    const { id } = req.params
    getDetailItemModel(id, (_err, item) => {
      if (item.length) {
        deleteItemModel(id, (err, result) => {
          if (!err) {
            if (result.affectedRows) {
              res.send({
                succes: true,
                message: `Data ID ${id} has been deleted`
              })
            } else {
              res.send({
                succes: false,
                message: 'Failed to delete data'
              })
            }
          } else {
            res.send({
              succes: false,
              message: 'Error'
            })
          }
        })
      } else {
        res.send({
          succes: false,
          message: 'Data not found'
        })
      }
    })
  },
  getItems: (req, res) => {
    let { page, limit, search, sort } = req.query
    let searchKey = ''
    let searchValue = ''

    if (typeof search === 'object') {
      searchKey = Object.keys(search)[0]
      searchValue = Object.values(search)[0]
    } else {
      searchKey = 'name'
      searchValue = search || ''
    }

    let sortKey = ''
    let sortValue = ''

    if (typeof sort === 'object') {
      sortKey = Object.keys(sort)[0]
      sortValue = Object.values(sort)[0]
    } else {
      sortKey = sort || 'id'
      sortValue = 'ASC'
    }

    if (searchKey === 'category') {
      searchKey = 'categories.category_name'
    }

    if (searchKey === 'sub_category') {
      searchKey = 'sub_category.sub_category_name'
    }

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
    getItemModel([searchKey, searchValue, sortKey, sortValue, limit, offset], result => {
      const pageInfo = {
        count: 0,
        pages: 0,
        currentPage: page,
        limitPerPage: limit,
        nextLink: null,
        prevLink: null
      }
      if (result.length) {
        getItemCountModel([searchKey, searchValue], data => {
          const { count } = data[0]
          pageInfo.count = count
          pageInfo.pages = Math.ceil(count / limit)

          const { pages, currentPage } = pageInfo

          if (currentPage < pages) {
            pageInfo.nextLink = `http://localhost:8080/items?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
          }

          if (currentPage > 1) {
            pageInfo.prevLink = `http://localhost:8080/items?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
          }
          res.send({
            succes: true,
            message: 'List of items',
            data: result,
            pageInfo
          })
        })
      } else {
        res.send({
          succes: false,
          message: 'There is no items on list',
          pageInfo
        })
      }
    })
  }
}
