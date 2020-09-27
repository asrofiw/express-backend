const model = require('../helpers/model')

module.exports = {
  createUserModel: (arr = []) => {
    const query = `INSERT INTO users (user_id, email, password)
      VALUES (${arr[0]}, '${arr[1]}', '${arr[2]}')`
    return model(query)
  },
  createUserDetailModel: (arr = []) => {
    const query = `INSERT INTO users_detail (name, phone_number, gender, address, date_of_birth, role_id, image)
    VALUES ('${arr[0]}', '${arr[1]}', '${arr[2]}', '${arr[3]}', '${arr[4]}', ${arr[5]}, '${arr[6]}')`
    return model(query)
  },
  getUserByConditionModel: (data = {}) => {
    const query = 'SELECT * FROM users WHERE ?'
    return model(query, data)
  },
  getUserModel: () => {
    const query = `SELECT * FROM users
      INNER JOIN users_detail ON users_detail.id = users.user_id`
    return model(query)
  },
  getUserDetailModel: (id) => {
    const query = `SELECT * FROM users_detail
      INNER JOIN users ON users.user_id = users_detail.id
      WHERE users_detail.id = ${id}`
    return model(query)
  },
  updateUserAccessModel: (id, data = {}) => {
    const query = `UPDATE users SET ? WHERE user_id = ${id}`
    return model(query, data)
  },
  updateUserDetailModel: (id, data = {}) => {
    const query = `UPDATE users_detail SET ? WHERE id = ${id}`
    return model(query, data)
  },
  deleteUserModel: (id) => {
    const query = `DELETE FROM users_detail WHERE id = ${id}`
    return model(query)
  }
}
