const db = require('../helpers/db')
const table = 'categories'
const tableJoin = 'sub_category'

module.exports = {
  createCategoryModel: (name, cb) => {
    const query = `INSERT INTO ${table} (category_name) VALUE ('${name}')`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getAllCategoryModel: (cb) => {
    const query = `SELECT * FROM ${table}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  updateCategoryModel: (arr, cb) => {
    const query = `UPDATE ${table} SET category_name = '${arr[1]}' WHERE category_id = ${arr[0]}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  deleteCategoryModel: (id, cb) => {
    const query = `DELETE FROM ${table} WHERE category_id = ${id}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getDetailCategoryModel: (arr, cb) => {
    const query = `SELECT ${table}.category_id, ${table}.category_name, ${tableJoin}.sub_category_name FROM ${table} INNER JOIN ${tableJoin} ON ${table}.category_id = ${tableJoin}.category_id WHERE ${table}.category_id = ${arr[0]} LIMIT ${arr[1]} OFFSET ${arr[2]}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getCountCategoryModel: (_id, cb) => {
    const query = `SELECT COUNT(*) AS count FROM ${table} INNER JOIN ${tableJoin} ON ${table}.category_id = ${tableJoin}.category_id WHERE ${table}.category_id GROUP BY ${table}.category_id`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getDetailCategoryIDModel: (id, cb) => {
    const query = `SELECT * FROM ${table} where category_id = ${id}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  }
}
