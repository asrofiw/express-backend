const model = require('../helpers/model')
const table = 'cart'
const tableItems = 'items'

module.exports = {
  getPriceNameItemModel: (id) => {
    const query = `SELECT name, price FROM ${tableItems} WHERE id = ${id}`
    return model(query)
  },
  createCartModel: (arr) => {
    const query = `INSERT INTO ${table} (amount, id)
    VALUES (${arr[0]}, ${arr[1]})`
    return model(query)
  },
  createCartTotalModel: (arr) => {
    const query = `INSERT INTO cart_total (cart_total, cart_id) VALUES ('${arr[0]}', ${arr[1]})`
    return model(query)
  },
  updateAmountCartModel: (arr) => {
    const query = `UPDATE ${table} SET amount = ${arr[1]} WHERE cart_id = ${arr[0]}`
    return model(query)
  },
  updateTotalModel: (arr) => {
    const query = `UPDATE cart_total SET cart_total = ${arr[0]} WHERE cart_id = ${arr[1]}`
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
    const query = `SELECT cart.cart_id AS id, items.name AS item, items.price AS price, cart.amount AS amount, cart_total.cart_total AS total
    FROM cart 
    INNER JOIN cart_total ON cart_total.cart_id = cart.cart_id
    INNER JOIN items ON items.id = cart.id`
    console.log(query)
    return model(query)
  },
  getSummaryCartModel: () => {
    const query = 'SELECT SUM(cart_total) AS summary FROM cart_total'
    return model(query)
  }
}
