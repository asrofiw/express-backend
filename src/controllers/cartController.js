const { createCartModel, getPriceNameItemModel, updateAmountCartModel, getDetailIDCartModel, deleteCartModel, getSummaryCartModel, getCartModel } = require('../models/cartModel')
const responseStandard = require('../helpers/response')

module.exports = {
  createCart: async (req, res) => {
    const { amount, idItem } = req.body
    if (amount && idItem) {
      try {
        const data = await getPriceNameItemModel(idItem)
        const { name, price } = data[0]
        try {
          const result = await createCartModel([amount, price, idItem])
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
        } catch (err) {
          return responseStandard(res, 'Internal server error', 500, false)
        }
      } catch (err) {
        return responseStandard(res, 'Internal server error', 500, false)
      }
    } else {
      return responseStandard(res, 'Cannot get Item', 400, false)
    }
  },
  updateAmountCart: async (req, res) => {
    const { id } = req.params
    let { amount } = req.body
    amount = parseInt(amount)
    if (amount > 0) {
      try {
        const data = await getDetailIDCartModel(id)
        const cartID = data[0].cart_id
        const itemID = data[0].id
        try {
          const resultPrice = await getPriceNameItemModel(itemID)
          const { price } = resultPrice[0]
          try {
            const result = await updateAmountCartModel([cartID, amount, price])
            if (result.affectedRows) {
              return responseStandard(res, 'Amount added')
            } else {
              return responseStandard(res, 'Failed to add', 400, false)
            }
          } catch (err) {
            return responseStandard(res, 'Internal server error', 500, false)
          }
        } catch (err) {
          return responseStandard(res, 'Internal server error', 500, false)
        }
      } catch (err) {
        return responseStandard(res, 'Internal server error', 500, false)
      }
    } else {
      return responseStandard(res, 'Failed to get amount', 400, false)
    }
  },
  deleteCart: async (req, res) => {
    const { id } = req.params
    try {
      const data = await getDetailIDCartModel(id)
      if (data.length) {
        try {
          const result = await deleteCartModel(id)
          if (result.affectedRows) {
            return responseStandard(res, `Cart with id ${id} has been deleted`)
          } else {
            return responseStandard(res, 'Cannot delete', 400, false)
          }
        } catch (err) {
          return responseStandard(res, 'Internal server error', 500, false)
        }
      } else {
        return responseStandard(res, 'Id item in Cart not found', 404, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal server error', 500, false)
    }
  },
  getCart: async (_req, res) => {
    try {
      const resultSummary = await getSummaryCartModel()
      const { summary } = resultSummary[0]
      try {
        const result = await getCartModel()
        if (result.length) {
          return responseStandard(res, 'Summary price of Items', 200, true, { data: result, summary: summary })
        } else {
          return responseStandard(res, 'Failed to get summary', 400, false)
        }
      } catch (err) {
        return responseStandard(res, 'Internal server error', 500, false)
      }
    } catch (err) {
      return responseStandard(res, 'Internal server error', 500, false)
    }
  }
}
