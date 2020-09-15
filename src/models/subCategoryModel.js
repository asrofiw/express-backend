const db = require('../helpers/db')
const table = 'sub_category'
const tableJoin = 'categories'
const tableDetailJoin = 'items'

module.exports = {
  createSubCategoryModel: (arr, cb) => {
    const query = `INSERT INTO ${table} (sub_category_name, category_id) VALUES ('${arr[0]}', ${arr[1]})`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getAllSubCategoryModel: (arr, cb) => {
    const query = `SELECT ${table}.sub_category_id, ${table}.sub_category_name, ${tableJoin}.category_name FROM ${table} INNER JOIN ${tableJoin} ON ${table}.category_id = ${tableJoin}.category_id LIMIT ${arr[0]} OFFSET ${arr[1]}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  updateSubCategoryModel: (arr, cb) => {
    const query = `UPDATE ${table} SET sub_category_name = '${arr[1]}' WHERE sub_category_id = ${arr[0]}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  deleteSubCategoryModel: (id, cb) => {
    const query = `DELETE FROM ${table} WHERE sub_category_id = ${id}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getCountAllSubCategoryModel: (_arr, cb) => {
    const query = `SELECT COUNT(*) AS count FROM ${table}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getDetailSubCategoryIDModel: (id, cb) => {
    const query = `SELECT * FROM ${table} where sub_category_id = ${id}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getDetailSubCategoryModel: (arr, cb) => {
    const query = `SELECT ${table}.sub_category_id, ${table}.sub_category_name, ${tableDetailJoin}.name 
    FROM ${table} 
    INNER JOIN ${tableDetailJoin} ON ${table}.sub_category_id = ${tableDetailJoin}.sub_category_id 
    WHERE ${table}.sub_category_id = ${arr[0]} LIMIT ${arr[1]} OFFSET ${arr[2]}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getCountSubCategoryModel: (arr, cb) => {
    const query = `SELECT COUNT(*) AS count FROM ${table} INNER JOIN ${tableDetailJoin} ON ${table}.sub_category_id = ${tableDetailJoin}.sub_category_id WHERE ${table}.sub_category_id GROUP BY ${table}.sub_category_name = '${arr[1]}'`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  }
}
