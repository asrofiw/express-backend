const qs = require('querystring')
const responseStandard = require('../helpers/response')
const {
  createItemModel,
  getDetailItemModel,
  getDetailItemIDModel,
  updateItemModel,
  updatePartialItemModel,
  deleteItemModel,
  getItemModel,
  getItemCountModel
  // createImageModel
} = require('../models/itemsModel')

module.exports = {
  createItem: async (req, res) => {
    const { name, price, description, categoryID, subCategoryID } = req.body
    // let { path } = req.file
    // path = path.split('\\')
    // path.shift()
    // path = path.join('/')

    // const urlImage = process.env.APP_URL.concat(path)

    if (name && price && description && categoryID && subCategoryID) {
      try {
        const result = await createItemModel([name, price, description, categoryID, subCategoryID])

        // try {
        //   const { id } = result.insertId
        //   const image = await createImageModel([id, urlImage])
        // } catch (err) {
        //   return responseStandard(res, 'Internal server error', 500, false)
        // }
        const data = {
          id: result.insertId,
          ...req.body
        }

        return responseStandard(res, 'Item has been created', 200, true, { data })
      } catch (err) {
        return responseStandard(res, 'Internal server error', 500, false)
      }
    } else {
      return responseStandard(res, 'All field must be filled', 400, false)
    }
  },
  getDetailItem: async (req, res) => {
    const { id } = req.params
    try {
      const item = await getDetailItemModel(id)
      const data = item.map(element => ({
        id: element.id,
        name: element.name,
        description: element.description,
        category: element.category,
        sub_category: element.sub_category,
        price: element.price
      }))

      if (item.length) {
        return responseStandard(res, `Detail item ${data[0].name}`, 200, true, { data })
      } else {
        return responseStandard(res, `Data with id ${id} not found`, 404, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal Server Error', 500, false)
    }
  },
  updateItem: async (req, res) => {
    const { id } = req.params
    const { name, price, description, categoryID, subCategoryID } = req.body
    if (name.trim() && price.trim() && description.trim() && categoryID.trim() && subCategoryID.trim()) {
      try {
        const items = await getDetailItemIDModel(id)
        if (items.length) {
          try {
            const result = await updateItemModel([id, name, price, description, categoryID, subCategoryID])
            if (result.affectedRows) {
              return responseStandard(res, `Item with id ${id} has been updated`)
            } else {
              return responseStandard(res, 'Failed to update data', 400, false)
            }
          } catch (err) {
            return responseStandard(res, 'Internal Server Error', 500, false)
          }
        } else {
          return responseStandard(res, `ID ${id} not found`, 404, false)
        }
      } catch (err) {
        return responseStandard(res, 'Internal Server Error', 500, false)
      }
    } else {
      return responseStandard(res, 'All data have to be updated', 400, false)
    }
  },
  updatePartialItem: async (req, res) => {
    const { id } = req.params
    const { name = '', price = '', description = '', categoryID = '', subCategoryID = '' } = req.body
    if (name.trim() || price.trim() || description.trim() || categoryID.trim() || subCategoryID.trim()) {
      try {
        const item = await getDetailItemIDModel(id)
        if (item.length) {
          const data = Object.entries(req.body).map(element => {
            return parseInt(element[1]) > 0 ? `${element[0]} = ${element[1]}` : `${element[0]} = '${element[1]}'`
          })
          try {
            const result = await updatePartialItemModel([id, data])

            if (result.affectedRows) {
              return responseStandard(res, `Item with id ${id} has been updated`)
            } else {
              return responseStandard(res, 'Failed to update data', 400, false)
            }
          } catch (err) {
            return responseStandard(res, 'Internal Server Error', 500, false)
          }
        } else {
          return responseStandard(res, 'Item not found', 404, false)
        }
      } catch (err) {
        return responseStandard(res, 'Internal Server Error', 500, false)
      }
    } else {
      return responseStandard(res, 'At least one column is filled', 400, false)
    }
  },
  deleteItem: async (req, res) => {
    const { id } = req.params
    try {
      const item = await getDetailItemModel(id)
      if (item.length) {
        try {
          const result = await deleteItemModel(id)
          if (result.affectedRows) {
            return responseStandard(res, `Data ID ${id} has been deleted`)
          } else {
            return responseStandard(res, 'Failed to delete data', 400, false)
          }
        } catch (err) {
          return responseStandard(res, 'Internal Server Error', 500, false)
        }
      } else {
        return responseStandard(res, 'Data not found', 400, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal Server Error', 500, false)
    }
  },
  getItems: async (req, res) => {
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
    try {
      const result = await getItemModel([searchKey, searchValue, sortKey, sortValue, limit, offset])

      const dataResult = result.map(element => ({
        id: element.id,
        name: element.name,
        category: element.category,
        sub_category: element.sub_category,
        price: element.price,
        url_image: element.url_image
      }))

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
          const data = await getItemCountModel([searchKey, searchValue])
          const { count } = data[0]
          pageInfo.count = count
          pageInfo.pages = Math.ceil(count / limit)

          const { pages, currentPage } = pageInfo

          if (currentPage < pages) {
            pageInfo.nextLink = `http://localhost:8080/public/items?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
          }

          if (currentPage > 1) {
            pageInfo.prevLink = `http://localhost:8080/public/items?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
          }

          return responseStandard(res, 'List of Items', 200, true, { dataResult, pageInfo })
        } catch (err) {
          return responseStandard(res, 'Internal Server Error', 500, false)
        }
      } else {
        return responseStandard(res, 'There is no Items on list', 400, false, { pageInfo })
      }
    } catch (err) {
      return responseStandard(res, 'Internal Server Error', 500, false)
    }
  }
}
