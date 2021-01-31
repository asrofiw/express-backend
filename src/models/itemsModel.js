const model = require('../helpers/model')
const table = 'items'
const tableCategories = 'categories'
const tableSubCategory = 'sub_category'

module.exports = {
  createItemModel: (arr = []) => {
    const query = `INSERT INTO ${table} (name, price, description, category_id, sub_category_id, user_id) 
      VALUES ('${arr[0]}', ${arr[1]}, '${arr[2]}', ${arr[3]}, ${arr[4]}, ${arr[5]})`
    return model(query)
  },

  createImageModel: (data) => {
    const query = `INSERT INTO items_image (items_id, url)
      VALUES ${data}`
    return model(query)
  },

  getDetailItemModel: (id) => {
    const query = `SELECT items.id, ${table}.name, price, ${table}.description,
      ${table}.category_id AS categoryID, ${table}.sub_category_id AS subCategoryID,
      ${tableCategories}.category_name AS category, ${tableSubCategory}.sub_category_name AS sub_category
      FROM ${table}
      INNER JOIN ${tableCategories} ON ${tableCategories}.id = ${table}.category_id
      INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.id = ${table}.sub_category_id
      WHERE items.id = ${id}`
    return model(query)
  },

  getDetailItemModelBySeller: (arr = []) => {
    const query = `SELECT items.id, ${table}.name, price, ${table}.description,
      ${table}.category_id AS categoryID, ${table}.sub_category_id AS subCategoryID,
      ${tableCategories}.category_name AS category, ${tableSubCategory}.sub_category_name AS sub_category
      FROM ${table}
      INNER JOIN ${tableCategories} ON ${tableCategories}.id = ${table}.category_id
      INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.id = ${table}.sub_category_id
      WHERE items.id = ${arr[0]} && user_id = ${arr[1]}`
    return model(query)
  },

  getImagesModel: (id) => {
    const query = `SELECT * from items_image WHERE items_id = ${id}`
    return model(query)
  },

  getDetailItemIDModel: (id) => {
    const query = `SELECT * FROM ${table} WHERE id = ${id}`
    return model(query)
  },

  updatePartialItemModel: (arr = []) => {
    const query = `UPDATE ${table} SET ${arr[0]} WHERE id = ${arr[1]} && user_id = ${arr[2]}`
    return model(query)
  },

  updateImagesItemModel: (data) => {
    const query = `INSERT INTO items_image (id, url, items_id) VALUES ${data}
      ON DUPLICATE KEY UPDATE url = VALUES(url), items_id = VALUES(items_id)`
    return model(query)
  },

  deleteItemModel: (arr = []) => {
    const query = `DELETE FROM ${table} WHERE id = ${arr[0]} && user_id = ${arr[1]}`
    return model(query)
  },

  getItemModel: (arr = []) => {
    const query = `SELECT ${table}.id, ${table}.name, ${table}.price,
      ${table}.category_id AS categoryID, ${tableCategories}.category_name AS category, 
      ${table}.sub_category_id AS subCategoryID, ${tableSubCategory}.sub_category_name AS sub_category
      FROM ${table} 
      INNER JOIN ${tableCategories} ON ${tableCategories}.id = ${table}.category_id
      INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.id = ${table}.sub_category_id
      WHERE ${table}.${arr[0]} LIKE '%${arr[1]}%' ORDER BY ${table}.${arr[2]} ${arr[3]} LIMIT ${arr[4]} OFFSET ${arr[5]}`
    return model(query)
  },

  getItemCountModel: (arr = []) => {
    const query = `SELECT COUNT(*) AS count
      FROM ${table}
      INNER JOIN ${tableCategories} ON ${tableCategories}.id = ${table}.category_id
      INNER JOIN ${tableSubCategory} ON ${tableSubCategory}.id = ${table}.sub_category_id
      WHERE ${table}.${arr[0]} LIKE '%${arr[1]}%'`
    return model(query)
  }
}
