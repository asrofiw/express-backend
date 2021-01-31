const response = require('../helpers/response')
const joi = require('joi')
const upload = require('../helpers/upload').array('pictures', 5)
const multer = require('multer')
const pagination = require('../helpers/pagination')
const {
  createItemModel,
  getDetailItemModel,
  updatePartialItemModel,
  deleteItemModel,
  getItemModel,
  getItemCountModel,
  createImageModel,
  getImagesModel,
  getDetailItemModelBySeller,
  updateImagesItemModel
} = require('../models/itemsModel')

module.exports = {
  createItem: (req, res) => {
    upload(req, res, async err => {
      if (err instanceof multer.MulterError) {
        return response(res, 'Error Multer', 400, false, { error: err.message })
      } else if (err) {
        return response(res, 'Error Multer', 400, false, { error: err.message })
      }

      try {
        const { id } = req.user
        const roleId = req.user.role_id
        if (roleId === 2) {
          const schema = joi.object({
            name: joi.string().required(),
            price: joi.string().required(),
            description: joi.string().required(),
            categoryID: joi.string().required(),
            subCategoryID: joi.string().required()
          })

          const { value, error } = schema.validate(req.body)

          if (error) {
            return response(res, 'Error Joi', 400, false, { error: error.message })
          }

          let path = ''
          if (req.files.length > 0) {
            const imagesUpload = req.files
            console.log('imageuploads', imagesUpload)
            path = imagesUpload.map(element => {
              return element.path
            })
            path = path.map(element => {
              return element.split('/')
            })
            path.map(element => element.shift())
            console.log('path', path)
          } else {
            return response(res, 'Error', 400, false, { error: 'Input image is required' })
          }

          const { name, price, description, categoryID, subCategoryID } = value

          const result = await createItemModel([name, price, description, categoryID, subCategoryID, id])
          console.log(result)
          let data = {
            id: result.insertId,
            ...req.body
          }
          const idItem = data.id
          const urlImage = path.map(element => {
            return `(${idItem}, '${element.join('/')}'), `
          })
          const images = await createImageModel(urlImage.join('').slice(0, -2))
          if (images.affectedRows) {
            data = {
              ...data,
              image: urlImage
            }
            return response(res, 'Item has been created', 200, true, { data })
          } else {
            return response(res, 'Failed to upload image', 400, false)
          }
        } else {
          return response(res, 'Forbidden access', 401, false)
        }
      } catch (err) {
        return response(res, 'Internal server error', 500, false, { error: err.message })
      }
    })
  },

  updatePartialItem: async (req, res) => {
    upload(req, res, async err => {
      if (err instanceof multer.MulterError) {
        return response(res, 'Error Multer', 400, false, { error: err.message })
      } else if (err) {
        return response(res, 'Error Multer', 400, false, { error: err.message })
      }

      try {
        const { id } = req.user
        const roleId = req.user.role_id
        if (roleId === 2) {
          const { idItem } = req.params
          const schema = joi.object({
            name: joi.string(),
            price: joi.string(),
            description: joi.string(),
            category_id: joi.string(),
            sub_category_id: joi.string(),
            idImages: joi.array().items(joi.number()).single()
          })

          const { value, error } = schema.validate(req.body)
          if (error) {
            return response(res, 'Error Joi', 400, false, { error: error.message })
          }

          let path = ''
          let updateImages = {}
          let result = {}

          if (req.files.length > 0 && value.idImages) {
            const imagesUpload = req.files
            path = imagesUpload.map(element => {
              return `uploads/${element.filename}`
            })
            const data = []
            path.map((element, index) => {
              return data.push(`(${value.idImages[index]}, '${element}', ${idItem})`)
            })
            updateImages = await updateImagesItemModel(data.join(','))
            if (!updateImages.affectedRows) {
              return response(res, 'Failed to update image', 400, false)
            }
            delete value.idImages
          } else {
            path = undefined
          }

          if (Object.values(value).length > 0) {
            const item = await getDetailItemModelBySeller([idItem, id])
            if (item.length) {
              const data = Object.entries(value).map(element => {
                return parseInt(element[1]) > 0 ? `${element[0]} = ${element[1]}` : `${element[0]} = '${element[1]}'`
              })
              result = await updatePartialItemModel([data, idItem, id])

              if (!result.affectedRows) {
                return response(res, 'Failed to update data', 400, false)
              }
            } else {
              return response(res, 'Item not found', 404, false)
            }
          }

          if (result.affectedRows || updateImages.affectedRows) {
            return response(res, `Item with id ${idItem} has been updated`)
          }
        } else {
          return response(res, 'Forbidden access', 401, false)
        }
      } catch (err) {
        return response(res, 'Internal Server Error', 500, false, { error: err.message })
      }
    })
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.user
      const roleId = req.user.role_id
      if (roleId === 2) {
        const { idItem } = req.params
        const item = await getDetailItemModelBySeller([idItem, id])
        if (item.length) {
          const result = await deleteItemModel([idItem, id])
          if (result.affectedRows) {
            return response(res, `Data ID ${idItem} has been deleted`)
          } else {
            return response(res, 'Failed to delete data', 400, false)
          }
        } else {
          return response(res, 'Data not found', 404, false)
        }
      } else {
        return response(res, 'Forbidden access', 401, false)
      }
    } catch (err) {
      return response(res, 'Internal Server Error', 500, false, { error: err.message })
    }
  },

  getDetailItem: async (req, res) => {
    try {
      const { id } = req.params
      const item = await getDetailItemModel(id)
      if (item.length) {
        let data = item.map(element => ({
          id: element.id,
          name: element.name,
          description: element.description,
          category: element.category,
          sub_category: element.sub_category,
          price: element.price
        }))
        const getImages = await getImagesModel(id)
        if (getImages.length) {
          const url = getImages.map(e => e.url)
          data = {
            ...data[0],
            url: url
          }
        } else {
          data = {
            ...data[0],
            url: null
          }
        }
        return response(res, `Detail item ${data.name}`, 200, true, { data })
      } else {
        return response(res, `Data with id ${id} not found`, 404, false)
      }
    } catch (err) {
      return response(res, 'Internal Server Error', 500, false, { error: err.message })
    }
  },

  getItems: async (req, res) => {
    try {
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
      const result = await getItemModel([searchKey, searchValue, sortKey, sortValue, limit, offset])

      const dataResult = result.map(element => ({
        id: element.id,
        name: element.name,
        category: element.category,
        sub_category: element.sub_category,
        price: element.price,
        url_image: element.url_image
      }))

      if (result.length) {
        const data = await getItemCountModel([searchKey, searchValue])
        const { count } = data[0]
        const pageInfo = pagination(req, count, '', 'items', 'public')

        return response(res, 'List of Items', 200, true, { dataResult, pageInfo })
      } else {
        return response(res, 'There is no Items on list', 400, false)
      }
    } catch (err) {
      return response(res, 'Internal Server Error', 500, false, { error: err.message })
    }
  }
}
