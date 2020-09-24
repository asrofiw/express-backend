const db = require('../helpers/db')
const table = 'items'
const tableCategories = 'categories'
const tableSubCategory = 'sub_category'

module.exports = {
  createItemModel: (arr = []) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ${table} (name, price, description, category_id, sub_category_id, url_image) 
        VALUES ('${arr[0]}', ${arr[1]}, '${arr[2]}', ${arr[3]}, ${arr[4]}, '${arr[5]}')`
      db.query(query, (err, result, _field) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  getDetailItemModel: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, name, price, description, url_image, ${table}.category_id AS categoryID, ${table}.sub_category_id AS subCategoryID,
        ${tableCategories}.category_name AS category, ${tableSubCategory}.sub_category_name AS sub_category
        FROM ${table}
        INNER JOIN ${tableCategories} ON ${tableCategories}.category_id = ${table}.category_id
        INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.sub_category_id = ${table}.sub_category_id
        WHERE id = ${id}`
      db.query(query, (err, result, _field) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  getDetailItemIDModel: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${table} WHERE id = ${id}`
      db.query(query, (err, result, _field) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  updateItemModel: (arr = []) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE ${table}
      SET name = '${arr[1]}', price = ${arr[2]}, description = '${arr[3]}', category_id = ${arr[4]}, sub_category_id = ${arr[5]}
      WHERE id = ${arr[0]}`
      db.query(query, (err, result, _field) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  updatePartialItemModel: (arr = []) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE ${table} SET ${arr[1]} WHERE id = ${arr[0]}`
      db.query(query, (err, result, _field) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  deleteItemModel: (id) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM ${table} WHERE id = ${id}`
      db.query(query, (err, result, _field) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  getItemModel: (arr = []) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, name, price, url_image,
        ${table}.category_id AS categoryID, ${tableCategories}.category_name AS category, 
        ${table}.sub_category_id AS subCategoryID, ${tableSubCategory}.sub_category_name AS sub_category
        FROM ${table} 
        INNER JOIN ${tableCategories} ON ${tableCategories}.category_id = ${table}.category_id
        INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.sub_category_id = ${table}.sub_category_id
        WHERE ${arr[0]} LIKE '%${arr[1]}%' ORDER BY ${arr[2]} ${arr[3]} LIMIT ${arr[4]} OFFSET ${arr[5]}`

      db.query(query, (err, result, field) => {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  },
  getItemCountModel: (arr = []) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS count
    FROM ${table}
    INNER JOIN ${tableCategories} ON ${tableCategories}.category_id = ${table}.category_id
    INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.sub_category_id = ${table}.sub_category_id
    WHERE ${arr[0]} LIKE '%${arr[1]}%'`
      db.query(query, (err, result, _field) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}
