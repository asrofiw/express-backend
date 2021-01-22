const {
  createCartModel,
  getPriceNameItemModel,
  updateQuantityCartModel,
  getDetailIDCartModel,
  deleteCartModel,
  getSummaryCartModel,
  getCartModel,
  createCartTotalModel,
  updateTotalModel,
  getCountCartModel
} = require('../models/cartModel')
const responseStandard = require('../helpers/response')
const { getImagesModel } = require('../models/itemsModel')

module.exports = {
  createCart: async (req, res) => {
    try {
      const { id } = req.user
      const roleId = req.user.role_id
      if (roleId === 3) {
        const { quantity, idItem } = req.body
        if (quantity && idItem) {
          const data = await getPriceNameItemModel(idItem)
          const { name, price } = data[0]
          const result = await createCartModel([quantity, idItem, id])
          if (result.affectedRows) {
            const data = {
              id: result.insertId,
              ...req.body,
              item: name,
              total: (price * quantity)
            }
            const { id, total } = data
            const setTotal = await createCartTotalModel([total, id])
            if (setTotal.affectedRows) {
              return responseStandard(res, 'Item has been added to Cart', 200, true, { data })
            } else {
              return responseStandard(res, 'Failed to set Total', 400, false)
            }
          } else {
            return responseStandard(res, 'Cannot add Item to Cart', 400, false)
          }
        } else {
          return responseStandard(res, 'Cannot get Item', 400, false)
        }
      } else {
        return responseStandard(res, 'Forbidden Access', 401, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal server error', 500, false, { error: err.message })
    }
  },

  updateQuantityCart: async (req, res) => {
    try {
      const { id } = req.params
      const roleId = req.user.role_id
      if (roleId === 3) {
        let { quantity } = req.body
        quantity = parseInt(quantity)
        if (quantity > 0) {
          const data = await getDetailIDCartModel(id)
          const cartID = data[0].id
          const itemID = data[0].item_id
          const resultPrice = await getPriceNameItemModel(itemID)
          const { price } = resultPrice[0]
          const result = await updateQuantityCartModel([cartID, quantity])
          if (result.affectedRows) {
            const total = price * quantity
            const updateTotal = await updateTotalModel([total, cartID])
            if (updateTotal.affectedRows) {
              return responseStandard(res, 'Quantity updated')
            } else {
              return responseStandard(res, 'Failed to update total', 400, false)
            }
          } else {
            return responseStandard(res, 'Failed to add', 400, false)
          }
        } else {
          return responseStandard(res, 'Failed to get quantity, Not Found', 404, false)
        }
      } else {
        return responseStandard(res, 'Forbidden Access', 401, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal server error', 500, false, { error: err.message })
    }
  },

  deleteCart: async (req, res) => {
    try {
      const { id } = req.params
      const roleId = req.user.role_id
      if (roleId === 3) {
        const data = await getDetailIDCartModel(id)
        if (data.length) {
          const result = await deleteCartModel(id)
          if (result.affectedRows) {
            return responseStandard(res, `Cart with id ${id} has been deleted`)
          } else {
            return responseStandard(res, 'Cannot delete', 400, false)
          }
        } else {
          return responseStandard(res, 'Id item in Cart not found', 404, false)
        }
      } else {
        return responseStandard(res, 'Forbidden Access', 401, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal server error', 500, false, { error: err.message })
    }
  },

  getCart: async (req, res) => {
    try {
      const { id } = req.user
      const roleId = req.user.role_id
      if (roleId === 3) {
        const resultSummary = await getSummaryCartModel(id)
        const { summary } = resultSummary[0]
        const getCart = await getCartModel(id)
        if (getCart.length) {
          const url = []
          for await (const e of getCart) {
            const getImage = await getImagesModel(e.item_id)
            if (!getImage.length) {
              url.push('There is no image on this item')
            } else {
              url.push(`${Object.values(getImage[0])}`)
            }
          }

          const getCount = await getCountCartModel(id)
          const { count } = getCount[0]

          const results = getCart.map((e, i) => {
            return {
              id: e.my_cart_id,
              item: e.name,
              image: url[i],
              price: e.price,
              quantity: e.quantity,
              total: e.total
            }
          })

          return responseStandard(res, 'Summary price of Items', 200, true, { data: results, summary: summary, count: count })
        } else {
          return responseStandard(res, 'Failed to set Cart', 400, false)
        }
      } else {
        return responseStandard(res, 'Forbidden Access', 401, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal server error', 500, false, { error: err.message })
    }
  }
}
