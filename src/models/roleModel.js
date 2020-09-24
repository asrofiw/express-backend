const model = require('../helpers/model')

module.exports = {
  createRoleModel: (arr = []) => {
    const query = `INSERT INTO roles (name, description) VALUES ('${arr[0]}', '${arr[1]}')`
    return model(query)
  },
  getAllRoleModel: () => {
    const query = 'SELECT * FROM roles'
    return model(query)
  },
  getRoleIdModel: (id) => {
    const query = `SELECT * FROM roles WHERE id = ${id}`
    return model(query)
  },
  updateRoleModel: (arr = []) => {
    const query = `UPDATE roles SET ${arr[0]} WHERE id = ${arr[1]}`
    return model(query)
  },
  deleteRoleModel: (id) => {
    const query = `DELETE FROM roles WHERE id = ${id}`
    return model(query)
  }
}
