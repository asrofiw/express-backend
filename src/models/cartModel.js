const model = require('../helpers/model')
const table = 'cart'
const tableItems = 'items'

module.exports = {
  getPriceNameItemModel: (id) => {
    const query = `SELECT name, price FROM ${tableItems} WHERE id = ${id}`
    return model(query)
  },
  createCartModel: (arr) => {
    const query = `INSERT INTO ${table} (amount, cart_total, id)
    VALUES (${arr[0]}, (${arr[0]}*${arr[1]}), ${arr[2]})`
    return model(query)
  },
  updateAmountCartModel: (arr) => {
    const query = `UPDATE ${table} SET amount = ${arr[1]}, cart_total = (${arr[1]}*${arr[2]})
    WHERE cart_id = ${arr[0]}`
    return model(query)
  },
  getDetailIDCartModel: (id) => {
    const query = `SELECT * FROM ${table} WHERE cart_id = ${id}`
    return model(query)
  },
  deleteCartModel: (id) => {
    const query = `DELETE FROM ${table} WHERE cart_id = ${id}`
    return model(query)
  },
  getCartModel: () => {
    const query = `SELECT cart_id AS id, ${tableItems}.name AS item, ${tableItems}.price AS price, amount, cart_total AS total
    FROM ${table}
    INNER JOIN ${tableItems} ON ${table}.id = ${tableItems}.id`
    return model(query)
  },
  getSummaryCartModel: () => {
    const query = `SELECT SUM(cart_total) AS summary FROM ${table}`
    return model(query)
  }
}
