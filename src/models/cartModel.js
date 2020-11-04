const model = require('../helpers/model')
const table = 'my_cart'
const tableItems = 'items'

module.exports = {
  getPriceNameItemModel: (id) => {
    const query = `SELECT name, price FROM ${tableItems} WHERE id = ${id}`
    return model(query)
  },
  createCartModel: (arr) => {
    const query = `INSERT INTO ${table} (quantity, item_id, user_id)
    VALUES (${arr[0]}, ${arr[1]}, ${arr[2]})`
    return model(query)
  },
  createCartTotalModel: (arr) => {
    const query = `INSERT INTO my_cart_total (total, my_cart_id) VALUES ('${arr[0]}', ${arr[1]})`
    return model(query)
  },
  updateQuantityCartModel: (arr) => {
    const query = `UPDATE ${table} SET quantity = ${arr[1]} WHERE id = ${arr[0]}`
    return model(query)
  },
  updateTotalModel: (arr) => {
    const query = `UPDATE my_cart_total SET total = ${arr[0]} WHERE my_cart_id = ${arr[1]}`
    return model(query)
  },
  getDetailIDCartModel: (id) => {
    const query = `SELECT * FROM ${table} WHERE id = ${id}`
    return model(query)
  },
  deleteCartModel: (id) => {
    const query = `DELETE FROM ${table} WHERE id = ${id}`
    return model(query)
  },
  getCartModel: (id) => {
    const query = `SELECT *
    FROM my_cart 
    INNER JOIN my_cart_total ON my_cart_total.my_cart_id = my_cart.id
    INNER JOIN items ON items.id = my_cart.item_id
    WHERE my_cart.user_id = ${id}`
    return model(query)
  },
  getCartIdModel: (id) => {
    const query = `SELECT *
    FROM my_cart 
    INNER JOIN my_cart_total ON my_cart_total.my_cart_id = my_cart.id
    INNER JOIN items ON items.id = my_cart.item_id
    WHERE my_cart.id = ${id}`
    return model(query)
  },
  getSummaryCartModel: (id) => {
    const query = `SELECT SUM(my_cart_total.total) AS summary FROM my_cart_total
    INNER JOIN my_cart ON my_cart.id = my_cart_total.my_cart_id
    WHERE my_cart.user_id = ${id}`
    return model(query)
  },
  getCountCartModel: (id) => {
    const query = `SELECT COUNT(id) AS count FROM my_cart WHERE user_id = ${id}`
    return model(query)
  }
}
