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
  getTransactionModel: (id) => {
    const query = `SELECT * FROM transaction WHERE user_id = ${id} GROUP BY transaction_id `
    return model(query)
  },
  getDetailTransactionModel: (id, transactionId) => {
    const query = `SELECT * FROM transaction WHERE user_id = ${id} && transaction_id = ${transactionId}`
    return model(query)
  }
}
