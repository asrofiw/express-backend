const model = require('../helpers/model')

module.exports = {
  createUserModel: (arr = []) => {
    const query = `INSERT INTO users (user_id, email, password)
      VALUES (${arr[0]}, '${arr[1]}', '${arr[2]}')`
    return model(query)
  },
  createUserDetailModel: (data = {}) => {
    const query = 'INSERT INTO users_detail SET ?'
    return model(query, data)
  },
  createUserAddressModel: (data = {}) => {
    const query = 'INSERT INTO users_address SET ?'
    return model(query, data)
  },
  createStoreModel: (data = {}) => {
    const query = 'INSERT INTO stores SET ?'
    return model(query, data)
  },
  getUserByConditionModel: (data = {}) => {
    const query = 'SELECT * FROM users WHERE ?'
    return model(query, data)
  },
  getUserRoleByConditionModel: (data = {}) => {
    const query = 'SELECT * FROM users_detail WHERE ?'
    return model(query, data)
  },
  getUserModel: () => {
    const query = `SELECT * FROM users
      INNER JOIN users_detail ON users_detail.id = users.user_id`
    return model(query)
  },
  getCustomerDetailModel: (id) => {
    const query = `SELECT * FROM users_detail
      INNER JOIN users ON users.user_id = users_detail.id
      WHERE users_detail.id = ${id}`
    return model(query)
  },
  getSellerDetailModel: (id) => {
    const query = `SELECT * FROM users_detail
      INNER JOIN users ON users.user_id = users_detail.id
      WHERE users_detail.id = ${id}`
    return model(query)
  },
  getUserAddressModel: (id) => {
    const query = `SELECT * FROM users_address WHERE user_id = ${id}`
    return model(query)
  },
  getStoreModel: (data = {}) => {
    const query = 'SELECT * FROM stores WHERE ?'
    return model(query, data)
  },
  updateUserAccessModel: (id, data = {}) => {
    const query = `UPDATE users SET ? WHERE user_id = ${id}`
    return model(query, data)
  },
  updateUserDetailModel: (id, data = {}) => {
    const query = `UPDATE users_detail SET ? WHERE id = ${id}`
    return model(query, data)
  },
  updateUserAddressModel: (id, data = {}) => {
    const query = `UPDATE users_address SET ? WHERE id = ${id}`
    return model(query, data)
  },
  updateStoreModel: (data = {}, id) => {
    const query = `UPDATE stores SET ? WHERE user_id = ${id}`
    return model(query, data)
  },
  deleteUserModel: (id) => {
    const query = `DELETE FROM users_detail WHERE id = ${id}`
    return model(query)
  },
  createUserBalanceModel: (data = {}) => {
    const query = 'INSERT INTO users_balance SET ?'
    return model(query, data)
  },
  topUpBalanceModel: (data = {}, id) => {
    const query = `UPDATE users_balance SET ? WHERE user_id = ${id}`
    return model(query, data)
  },
  getBalanceModel: (id, payment) => {
    const query = `SELECT balance from users_balance WHERE user_id = ${id} && payment_method = '${payment}'`
    return model(query)
  },
  getDetailBalanceModel: (id) => {
    const query = `SELECT * from users_balance WHERE user_id = ${id}`
    return model(query)
  }
}
