const { createCartModel, getPriceNameItemModel, updateAmountCartModel, getDetailIDCartModel, deleteCartModel, getSummaryCartModel, getCartModel } = require('../models/cartModel')

module.exports = {
  createCart: (req, res) => {
    const { amount, idItem } = req.body
    if (amount && idItem) {
      getPriceNameItemModel(idItem, (_err, result) => {
        const { name, price } = result[0]
        createCartModel([amount, price, idItem], (err, result) => {
          if (!err) {
            if (result.affectedRows) {
              res.status(201).send({
                succes: true,
                message: 'Item has been added to Cart',
                data: {
                  id: result.insertId,
                  ...req.body,
                  item: name,
                  total: (price * amount)
                }
              })
            } else {
              res.send({
                succes: false,
                message: 'Can not add to Cart'
              })
            }
          } else {
            res.send({
              succes: false,
              message: 'Database Error'
            })
          }
        })
      })
    } else {
      res.status(400).send({
        succes: false,
        message: 'All field must be filled'
      })
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
                  res.send({
                    succes: true,
                    message: `Amount cart id ${id} has been updated`
                  })
                } else {
                  res.send({
                    succes: false,
                    message: 'Failed to update'
                  })
                }
              } else {
                res.send({
                  succes: false,
                  message: 'Database error'
                })
              }
            })
          })
        } else {
          res.send({
            succes: false,
            message: 'Get detail Cart ID Failed'
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
  deleteCart: (req, res) => {
    const { id } = req.params
    getDetailIDCartModel(id, (_err, result) => {
      if (result.length) {
        deleteCartModel(id, (err, result) => {
          if (!err) {
            if (result.affectedRows) {
              res.send({
                succes: true,
                message: `Cart with id ${id} has been deleted`
              })
            } else {
              res.send({
                succes: false,
                message: 'Cart can not be deleted'
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
  getCart: (_req, res) => {
    getSummaryCartModel((_err, result) => {
      const { summary } = result[0]
      getCartModel((err, result) => {
        if (!err) {
          if (result.length) {
            res.send({
              succes: true,
              message: 'Summary price of items',
              data: result,
              summary: summary
            })
          } else {
            res.send({
              succes: false,
              message: 'Failed to summary price'
            })
          }
        } else {
          res.send({
            succes: false,
            message: 'Get cart model error'
          })
        }
      })
    })
  }
}
