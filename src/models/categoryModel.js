const model = require('../helpers/model')
const table = 'categories'
const tableJoin = 'sub_category'

module.exports = {
  createCategoryModel: (name) => {
    const query = `INSERT INTO ${table} (category_name) VALUE ('${name}')`
    return model(query)
  },
  getAllCategoryModel: () => {
    const query = `SELECT * FROM ${table}`
    return model(query)
  },
  updateCategoryModel: (arr) => {
    const query = `UPDATE ${table} SET category_name = '${arr[1]}' WHERE id = ${arr[0]}`
    return model(query)
  },
  deleteCategoryModel: (id) => {
    const query = `DELETE FROM ${table} WHERE id = ${id}`
    return model(query)
  },
  getDetailCategoryModel: (arr) => {
    const query = `SELECT ${table}.id, ${table}.category_name, ${tableJoin}.sub_category_name
    FROM ${table}
    INNER JOIN ${tableJoin} ON ${table}.id = ${tableJoin}.category_id
    WHERE ${table}.id = ${arr[0]} LIMIT ${arr[1]} OFFSET ${arr[2]}`
    return model(query)
  },
  getCountCategoryModel: (id) => {
    const query = `SELECT COUNT(*) AS count
    FROM ${table}
    INNER JOIN ${tableJoin} ON ${table}.id = ${tableJoin}.category_id
    WHERE ${table}.id = ${id} GROUP BY ${table}.id`
    return model(query)
  },
  getDetailCategoryIDModel: (id) => {
    const query = `SELECT * FROM ${table} where id = ${id}`
    return model(query)
  }
}
