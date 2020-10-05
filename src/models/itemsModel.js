const model = require('../helpers/model')
const table = 'items'
const tableCategories = 'categories'
const tableSubCategory = 'sub_category'

module.exports = {
  createItemModel: (arr = []) => {
    const query = `INSERT INTO ${table} (name, price, description, category_id, sub_category_id) 
      VALUES ('${arr[0]}', ${arr[1]}, '${arr[2]}', ${arr[3]}, ${arr[4]})`
    return model(query)
  },
  createImageModel: (data) => {
    const query = `INSERT INTO items_image (items_id, url)
      VALUES ${data}`
    return model(query, data)
  },
  getDetailItemModel: (id) => {
    const query = `SELECT items.id, ${table}.name, price, ${table}.description,
      ${table}.category_id AS categoryID, ${table}.sub_category_id AS subCategoryID,
      ${tableCategories}.name AS category, ${tableSubCategory}.sub_category_name AS sub_category
      FROM ${table}
      INNER JOIN ${tableCategories} ON ${tableCategories}.category_id = ${table}.category_id
      INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.sub_category_id = ${table}.sub_category_id
      WHERE items.id = ${id}`
    return model(query)
  },
  getImagesModel: (id) => {
    const query = `SELECT url from items_image WHERE items_id = ${id}`
    return model(query)
  },
  getDetailItemIDModel: (id) => {
    const query = `SELECT * FROM ${table} WHERE id = ${id}`
    return model(query)
  },
  updateItemModel: (arr = []) => {
    const query = `UPDATE ${table}
      SET name = '${arr[1]}', price = ${arr[2]}, description = '${arr[3]}', category_id = ${arr[4]}, sub_category_id = ${arr[5]}
      WHERE id = ${arr[0]}`
    return model(query)
  },
  updatePartialItemModel: (arr = []) => {
    const query = `UPDATE ${table} SET ${arr[1]} WHERE id = ${arr[0]}`
    return model(query)
  },
  deleteItemModel: (id) => {
    const query = `DELETE FROM ${table} WHERE id = ${id}`
    return model(query)
  },
  getItemModel: (arr = []) => {
    const query = `SELECT id, ${table}.name, price,
      ${table}.category_id AS categoryID, ${tableCategories}.name AS category, 
      ${table}.sub_category_id AS subCategoryID, ${tableSubCategory}.sub_category_name AS sub_category
      FROM ${table} 
      INNER JOIN ${tableCategories} ON ${tableCategories}.category_id = ${table}.category_id
      INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.sub_category_id = ${table}.sub_category_id
      WHERE ${table}.${arr[0]} LIKE '%${arr[1]}%' ORDER BY ${table}.${arr[2]} ${arr[3]} LIMIT ${arr[4]} OFFSET ${arr[5]}`
    return model(query)
  },
  getItemCountModel: (arr = []) => {
    const query = `SELECT COUNT(*) AS count
      FROM ${table}
      INNER JOIN ${tableCategories} ON ${tableCategories}.category_id = ${table}.category_id
      INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.sub_category_id = ${table}.sub_category_id
      WHERE ${table}.${arr[0]} LIKE '%${arr[1]}%'`
    return model(query)
  }
}
