const model = require('../helpers/model')

module.exports = {
  createCheckoutModel: (data = {}) => {
    const query = 'INSERT INTO checkout SET ?'
    return model(query, data)
  },
  createAllCheckoutModel: (data) => {
    const query = `INSERT INTO checkout (cart_id, item_id, user_id, item_name, item_price, quantity, total)
    VALUES ${data}`
    return model(query)
  },
  deleteCheckoutModel: (id) => {
    const query = `DELETE FROM checkout WHERE user_id = ${id}`
    return model(query)
  },
  getSummaryCheckoutModel: () => {
    const query = 'SELECT SUM(total) AS summary FROM checkout'
    return model(query)
  },
  getCheckoutByConditionModel: (id) => {
    const query = `SELECT * FROM checkout WHERE user_id = ${id}`
    return model(query)
  }
}
