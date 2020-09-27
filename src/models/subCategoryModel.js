const model = require('../helpers/model')
const table = 'sub_category'
const tableJoin = 'categories'
const tableDetailJoin = 'items'

module.exports = {
  createSubCategoryModel: (arr) => {
    const query = `INSERT INTO ${table} (sub_category_name, category_id) VALUES ('${arr[0]}', ${arr[1]})`
    return model(query)
  },
  getAllSubCategoryModel: (arr) => {
    const query = `SELECT ${table}.sub_category_id, ${table}.sub_category_name, ${tableJoin}.name
    FROM ${table}
    INNER JOIN ${tableJoin} ON ${table}.category_id = ${tableJoin}.category_id LIMIT ${arr[0]} OFFSET ${arr[1]}`
    return model(query)
  },
  updateSubCategoryModel: (arr) => {
    const query = `UPDATE ${table} SET sub_category_name = '${arr[1]}' WHERE sub_category_id = ${arr[0]}`
    return model(query)
  },
  deleteSubCategoryModel: (id) => {
    const query = `DELETE FROM ${table} WHERE sub_category_id = ${id}`
    return model(query)
  },
  getCountAllSubCategoryModel: () => {
    const query = `SELECT COUNT(*) AS count FROM ${table}`
    return model(query)
  },
  getDetailSubCategoryIDModel: (id) => {
    const query = `SELECT * FROM ${table} where sub_category_id = ${id}`
    return model(query)
  },
  getDetailSubCategoryModel: (arr) => {
    const query = `SELECT ${table}.sub_category_id, ${table}.sub_category_name, ${tableDetailJoin}.name 
      FROM ${table} 
      INNER JOIN ${tableDetailJoin} ON ${table}.sub_category_id = ${tableDetailJoin}.sub_category_id 
      WHERE ${table}.sub_category_id = ${arr[0]} LIMIT ${arr[1]} OFFSET ${arr[2]}`
    return model(query)
  },
  getCountSubCategoryModel: (arr) => {
    const query = `SELECT COUNT(*) AS count
    FROM ${table}
    INNER JOIN ${tableDetailJoin} ON ${table}.sub_category_id = ${tableDetailJoin}.sub_category_id
    WHERE ${table}.sub_category_id GROUP BY ${table}.sub_category_name = '${arr[1]}'`
    return model(query)
  }
}
