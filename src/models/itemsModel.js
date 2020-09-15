const db = require('../helpers/db')
const table = 'items'
const tableCategories = 'categories'
const tableSubCategory = 'sub_category'

module.exports = {
  createItemModel: (arr, cb) => {
    const query = `INSERT INTO ${table} (name, price, description, category_id, sub_category_id) 
    VALUES ('${arr[0]}', ${arr[1]}, '${arr[2]}', ${arr[3]}, ${arr[4]})`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getDetailItemModel: (id, cb) => {
    const query = `SELECT id, name, price, description, ${tableCategories}.category_name, ${tableSubCategory}.sub_category_name
    FROM ${table}
    INNER JOIN ${tableCategories} ON ${tableCategories}.category_id = ${table}.category_id
    INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.sub_category_id = ${table}.sub_category_id
    WHERE id = ${id}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getDetailItemIDModel: (id, cb) => {
    const query = `SELECT * FROM ${table} WHERE id = ${id}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  updateItemModel: (arr, cb) => {
    const query = `UPDATE ${table}
    SET name = '${arr[1]}', price = ${arr[2]}, description = '${arr[3]}', category_id = ${arr[4]}, sub_category_id = ${arr[5]}
    WHERE id = ${arr[0]}`
    db.query(query, (_err, result, _field) => {
      cb(result)
    })
  },
  updatePartialItemModel: (arr, cb) => {
    const query = `UPDATE ${table} SET ${arr[1]} WHERE id = ${arr[0]}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  deleteItemModel: (id, cb) => {
    const query = `DELETE FROM ${table} WHERE id = ${id}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getItemModel: (arr, cb) => {
    const query = `SELECT id, name, price, ${tableCategories}.category_name AS category, ${tableSubCategory}.sub_category_name AS sub_category
    FROM ${table} 
    INNER JOIN ${tableCategories} ON ${tableCategories}.category_id = ${table}.category_id
    INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.sub_category_id = ${table}.sub_category_id
    WHERE ${arr[0]} LIKE '%${arr[1]}%' ORDER BY ${arr[2]} ${arr[3]} LIMIT ${arr[4]} OFFSET ${arr[5]}`
    console.log(query)
    db.query(query, (_err, result, _field) => {
      cb(result)
    })
  },
  getItemCountModel: (arr, cb) => {
    const query = `SELECT COUNT(*) AS count
    FROM ${table}
    INNER JOIN ${tableCategories} ON ${tableCategories}.category_id = ${table}.category_id
    INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.sub_category_id = ${table}.sub_category_id
    WHERE ${arr[0]} LIKE '%${arr[1]}%'`
    console.log(query)
    db.query(query, (_err, result, _field) => {
      cb(result)
    })
  }
}
