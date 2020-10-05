const model = require('../helpers/model')

module.exports = {
  getTransactionIdModel: (id) => {
    const query = `SELECT transaction_id FROM transaction WHERE user_id = ${id}`
    return model(query)
  },
  createTransactionModel: (data) => {
    const query = `INSERT INTO transaction (transaction_id, item_id, item_name, quantity, item_price, total, user_id) VALUES ${data}`
    return model(query)
  },
  getTransactionModel: () => {
    const query = 'SELECT * FROM transaction'
    return model(query)
  },
  getDetailTransactionModel: (id) => {
    const query = `SELECT * FROM transaction WHERE transaction_id = ${id}`
    return model(query)
  }
}
