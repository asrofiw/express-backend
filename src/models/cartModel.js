const db = require('../helpers/db')
const table = 'cart'
const tableItems = 'items'

module.exports = {
  getPriceNameItemModel: (id, cb) => {
    const query = `SELECT name, price FROM ${tableItems} WHERE id = ${id}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  createCartModel: (arr, cb) => {
    const query = `INSERT INTO ${table} (amount, cart_total, id)
    VALUES (${arr[0]}, (${arr[0]}*${arr[1]}), ${arr[2]})`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  updateAmountCartModel: (arr, cb) => {
    const query = `UPDATE ${table} SET amount = ${arr[1]}, cart_total = (${arr[1]}*${arr[2]})
    WHERE cart_id = ${arr[0]}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getDetailIDCartModel: (id, cb) => {
    const query = `SELECT * FROM ${table} WHERE cart_id = ${id}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  deleteCartModel: (id, cb) => {
    const query = `DELETE FROM ${table} WHERE cart_id = ${id}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getCartModel: (cb) => {
    const query = `SELECT cart_id AS id, ${tableItems}.name AS item, ${tableItems}.price AS price, amount, cart_total AS total
    FROM ${table}
    INNER JOIN ${tableItems} ON ${table}.id = ${tableItems}.id`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getSummaryCartModel: (cb) => {
    const query = `SELECT SUM(cart_total) AS summary FROM ${table}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  }
}
