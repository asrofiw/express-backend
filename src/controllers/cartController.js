const { createCartModel, getPriceNameItemModel, updateAmountCartModel, getDetailIDCartModel, deleteCartModel, getSummaryCartModel, getCartModel } = require('../models/cartModel')
const responseStandard = require('../helpers/response')
module.exports = {
  createCart: (req, res) => {
    const { amount, idItem } = req.body
    if (amount && idItem) {
      getPriceNameItemModel(idItem, (_err, result) => {
        const { name, price } = result[0]
        createCartModel([amount, price, idItem], (err, result) => {
          if (!err) {
            if (result.affectedRows) {
              const data = {
                id: result.insertId,
                ...req.body,
                item: name,
                total: (price * amount)
              }
              return responseStandard(res, 'Item has been added to Cart', 200, true, { data })
            } else {
              return responseStandard(res, 'Cannot add Item to Cart', 400, false)
            }
          } else {
            return responseStandard(res, 'Internal server error', 500, false)
          }
        })
      })
    } else {
      return responseStandard(res, 'Cannot get Item', 400, false)
    }
  },
  updateAmountCart: (req, res) => {
    const { id } = req.params
    let { amount } = req.body
    amount = parseInt(amount)
    if (amount > 0) {
      getDetailIDCartModel(id, (err, result) => {
        const cartID = result[0].cart_id
        const itemID = result[0].id

        if (!err) {
          getPriceNameItemModel(itemID, (_err, result) => {
            const { price } = result[0]
            updateAmountCartModel([cartID, amount, price], (err, result) => {
              if (!err) {
                if (result.affectedRows) {
                  return responseStandard(res, 'Amount added')
                } else {
                  return responseStandard(res, 'Failed to add', 400, false)
                }
              } else {
                return responseStandard(res, 'Internal server error', 500, false)
              }
            })
          })
        } else {
          return responseStandard(res, 'Internal server error', 500, false)
        }
      })
    } else {
      return responseStandard(res, 'Failed to get amount', 400, false)
    }
  },
  deleteCart: (req, res) => {
    const { id } = req.params
    getDetailIDCartModel(id, (_err, result) => {
      if (result.length) {
        deleteCartModel(id, (err, result) => {
          if (!err) {
            if (result.affectedRows) {
              return responseStandard(res, `Cart with id ${id} has been deleted`)
            } else {
              return responseStandard(res, 'Cannot delete', 400, false)
            }
          } else {
            return responseStandard(res, 'Internal server error', 500, false)
          }
        })
      }
    })
  },
  getCart: (_req, res) => {
    getSummaryCartModel((_err, result) => {
      const { summary } = result[0]
      getCartModel((err, result) => {
        if (!err) {
          if (result.length) {
            return responseStandard(res, 'Summary price of Items', 200, true, { data: result, summary: summary })
          } else {
            return responseStandard(res, 'Failed to get summary', 400, false)
          }
        } else {
          return responseStandard(res, 'Internal server error', 500, false)
        }
      })
    })
  }
}
