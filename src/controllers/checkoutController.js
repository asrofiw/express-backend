const Joi = require('joi')
const response = require('../helpers/response')
const { getCartModel, getCartIdModel } = require('../models/cartModel')
const { getImagesModel } = require('../models/itemsModel')
const {
  createCheckoutModel,
  createAllCheckoutModel,
  getSummaryCheckoutModel,
  getCheckoutByConditionModel,
  deleteCheckoutModel
} = require('../models/checkoutModel')

module.exports = {
  createCheckout: async (req, res) => {
    try {
      const { id } = req.user
      const roleId = req.user.role_id
      if (roleId === 3) {
        const schema = Joi.object({
          cartId: Joi.array().items(Joi.string()).single()
        })

        const { value, error } = schema.validate(req.body)
        if (error) {
          return response(res, 'Error', 400, false, { error: error.message })
        }
        const getCart = await getCartModel(id)
        if (getCart.length) {
          let results = getCart.map(e => {
            return {
              cart_id: e.my_cart_id,
              item_id: e.item_id,
              user_id: e.user_id,
              item_name: e.name,
              item_price: e.price,
              quantity: e.quantity,
              total: e.total
            }
          })
          const isExist = await getCheckoutByConditionModel(id)
          if (isExist.length > 0) {
            await deleteCheckoutModel(id)
          }
          if (Object.values(value).length > 0) {
            const { cartId } = value
            let data = []
            const url = []
            for await (const e of cartId) {
              const getCart = await getCartIdModel(e)
              if (getCart.length) {
                const getImage = await getImagesModel(getCart[0].item_id)
                if (getImage.length) {
                  url.push(`${Object.values(getImage[0])}`)
                } else {
                  url.push('There is no image on this item')
                }
                data.push(getCart[0])
              } else {
                return response(res, 'Failed to get Cart', 404, false)
              }
            }
            data = data.map(e => {
              return {
                cart_id: e.my_cart_id,
                item_id: e.item_id,
                user_id: e.user_id,
                item_name: e.name,
                item_price: e.price,
                quantity: e.quantity,
                total: e.total
              }
            })
            let postCheckout = {}
            for await (const e of data) {
              postCheckout = await createCheckoutModel(e)
            }
            if (postCheckout.affectedRows) {
              const resultSummary = await getSummaryCheckoutModel()
              const { summary } = resultSummary[0]
              data = data.map((e, i) => {
                return {
                  id: e.cart_id,
                  item: e.item_name,
                  image: url[i],
                  price: e.item_price,
                  quantity: e.quantity,
                  total: e.total
                }
              })
              return response(res, 'Checkout', 200, true, { data: data, summary: summary })
            } else {
              return response(res, 'Failed to create checkout', 400, false)
            }
          } else {
            const createAll = results.map(e => {
              return `(${e.cart_id}, ${e.item_id}, ${e.user_id}, '${e.item_name}', ${e.item_price}, ${e.quantity}, '${e.total}')`
            })
            const createAllCheckout = await createAllCheckoutModel(createAll.join(', '))
            if (createAllCheckout.affectedRows) {
              const resultSummary = await getSummaryCheckoutModel()
              const { summary } = resultSummary[0]
              const url = []
              for await (const e of results) {
                const getImage = await getImagesModel(e.item_id)
                if (getImage.length) {
                  url.push(`${Object.values(getImage[0])}`)
                } else {
                  url.push('There is no image on this item')
                }
              }
              results = results.map((e, i) => {
                return {
                  id: e.cart_id,
                  item: e.item_name,
                  image: url[i],
                  price: e.item_price,
                  quantity: e.quantity,
                  total: e.total
                }
              })
              return response(res, 'Checkout', 200, true, { data: results, summary: summary, deliveryFee: 10000 })
            }
          }
        } else {
          return response(res, 'Failed to set Cart', 400, false)
        }
      } else {
        return response(res, 'Forbidden Access', 401, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false, { error: err.message })
    }
  }
}
