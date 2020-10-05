const response = require('../helpers/response')
const { getCheckoutByConditionModel, getSummaryCheckoutModel, deleteCheckoutModel } = require('../models/checkoutModel')
const { getTransactionIdModel, createTransactionModel, getTransactionModel, getDetailTransactionModel } = require('../models/transactionModel')
const { getBalanceModel, topUpBalanceModel } = require('../models/userModel')

module.exports = {
  createTransaction: async (req, res) => {
    const { id } = req.user
    const roleId = req.user.role_id
    if (roleId === 3) {
      const getCheckout = await getCheckoutByConditionModel(id)
      if (getCheckout.length) {
        let transactionId; let orderFee; let balance = 0
        const getTransactionId = await getTransactionIdModel(id)
        if (!getTransactionId.length) {
          transactionId = 1
        } else {
          transactionId = getTransactionId[getTransactionId.length - 1].transaction_id + 1
        }
        let data = getCheckout.map(e => {
          return {
            transaction_id: transactionId,
            item_id: e.item_id,
            item_name: e.item_name,
            quantity: e.quantity,
            item_price: e.item_price,
            total: e.total,
            user_id: id
          }
        })
        const getOrderFee = await getSummaryCheckoutModel(id)
        if (getOrderFee.length) {
          orderFee = getOrderFee[0].summary
        } else {
          return response(res, 'Failed to get order fee', 400, false)
        }
        const deliveryFee = 10000
        const summary = orderFee + deliveryFee
        const getBalance = await getBalanceModel(id)
        if (getBalance.length) {
          balance = getBalance[0].balance
        } else {
          return response(res, 'Failed to get balance', 400, false)
        }
        if (balance > summary) {
          try {
            const dataTransaction = data.map(e => {
              return `(${e.transaction_id}, ${e.item_id}, '${e.item_name}', ${e.quantity}, '${e.item_price}', '${e.total}', ${e.user_id})`
            })
            const createTransaction = await createTransactionModel(dataTransaction.join(', '))
            if (createTransaction.affectedRows) {
              try {
                balance = balance - summary
                const updateBalance = await topUpBalanceModel({ balance: balance }, id)
                if (updateBalance.affectedRows) {
                  try {
                    const deleteCheckout = await deleteCheckoutModel(id)
                    if (deleteCheckout.affectedRows) {
                      data = data.map(e => {
                        return {
                          transaction_id: e.transaction_id,
                          item: e.item_name,
                          quantity: e.quantity,
                          price: e.item_price,
                          total: e.total
                        }
                      })

                      data = {
                        ...data,
                        order_fee: orderFee,
                        delivery_fee: deliveryFee,
                        summary: summary
                      }
                      return response(res, 'Transaction Succes', 200, true, { data })
                    } else {
                      return response(res, 'Failed to delete checkout', 400, false)
                    }
                  } catch (err) {
                    return response(res, 'Internal server error \'delete checkout\'', 500, false)
                  }
                } else {
                  return response(res, 'Failed to update balance', 400, false)
                }
              } catch (err) {
                return response(res, 'Internal server error \'update balance\'', 500, false)
              }
            } else {
              return response(res, 'Failed to create transaction', 400, false)
            }
          } catch (err) {
            return response(res, 'Internal server error \'create transaction\'', 500, false)
          }
        } else {
          return response(res, 'Transaction Failed, Try To Top Up Balance', 400, false)
        }
      } else {
        return response(res, 'Failed to get Checkout', 400, false)
      }
    } else {
      return response(res, 'Forbidden Access', 401, false)
    }
  },
  getTransaction: async (req, res) => {
    const roleId = req.user.role_id
    if (roleId === 3) {
      try {
        const getData = await getTransactionModel()
        if (getData.length) {
          const data = getData.map(e => {
            return {
              transaction_id: e.transaction_id,
              item: e.item_name,
              quantity: e.quantity,
              price: e.item_price,
              total: e.total
            }
          })
          return response(res, 'History Order', 200, true, { data })
        } else {
          return response(res, 'Failed to get data', 402, false)
        }
      } catch (err) {
        return response(res, 'Internal server error \'get transaction\'')
      }
    } else {
      return response(res, 'Forbidden Access', 401, false)
    }
  },
  getDetailTransaction: async (req, res) => {
    const { id } = req.params
    const roleId = req.user.role_id
    if (roleId === 3) {
      try {
        const data = await getDetailTransactionModel(id)
        if (data.length) {
          const results = data.map(e => {
            return {
              transaction_id: e.transaction_id,
              item: e.item_name,
              quantity: e.quantity,
              price: e.item_price,
              total: e.total
            }
          })
          return response(res, `History Order with Transaction ID ${id}`, 200, true, { results })
        } else {
          return response(res, 'Failed to get data', 400, false)
        }
      } catch (err) {
        return response(res, 'Internal server error \'get detail transaction\'')
      }
    } else {
      return response(res, 'Forbidden Access', 401, false)
    }
  }
}
