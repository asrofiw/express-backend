const Joi = require('joi')
const response = require('../helpers/response')
const { getCartModel } = require('../models/cartModel')
const { createCheckoutModel, createAllCheckoutModel, getSummaryCheckoutModel, getCheckoutByConditionModel, deleteCheckoutModel } = require('../models/checkoutModel')

module.exports = {
  createCheckout: async (req, res) => {
    const { id } = req.user
    const roleId = req.user.role_id
    if (roleId === 3) {
      const schema = Joi.object({
        cartId: Joi.string()
      })
      const { value, error } = schema.validate(req.body)
      if (error) {
        return response(res, 'Error', 400, false, { error: error.message })
      }
      try {
        try {
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
              try {
                const { cartId } = value
                results = {
                  cart_id: cartId,
                  user_id: id,
                  ...results[0]
                }

                const postCheckout = await createCheckoutModel(results)
                if (postCheckout.affectedRows) {
                  const resultSummary = await getSummaryCheckoutModel()
                  const { summary } = resultSummary[0]
                  results = {
                    id: results.cart_id,
                    item: results.item_name,
                    price: results.item_price,
                    quantity: results.quantity,
                    total: results.total
                  }
                  return response(res, 'Checkout', 200, true, { data: results, summary: summary })
                } else {
                  return response(res, 'Failed to create checkout', 400, false)
                }
              } catch (err) {
                return response(res, 'Internal server error \'create checkout\'', 500, false)
              }
            } else {
              try {
                const createAll = results.map(e => {
                  return `(${e.cart_id}, ${e.item_id}, ${e.user_id}, '${e.item_name}', ${e.item_price}, ${e.quantity}, '${e.total}')`
                })
                const createAllCheckout = await createAllCheckoutModel(createAll.join(', '))
                if (createAllCheckout.affectedRows) {
                  const resultSummary = await getSummaryCheckoutModel()
                  const { summary } = resultSummary[0]
                  results = results.map(e => {
                    return {
                      id: e.cart_id,
                      item: e.item_name,
                      price: e.item_price,
                      quantity: e.quantity,
                      total: e.total
                    }
                  })
                  return response(res, 'Checkout', 200, true, { data: results, summary: summary })
                }
              } catch (err) {
                return response(res, 'Internal server error \'create all checkout\'')
              }
            }
          } else {
            return response(res, 'Failed to set Cart', 400, false)
          }
        } catch (err) {
          return response(res, 'Internal server error', 500, false)
        }
      } catch (err) {
        return response(res, 'Internal server error', 500, false)
      }
    } else {
      return response(res, 'Forbidden Access', 401, false)
    }
  }
}
