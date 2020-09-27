const db = require('./db')

module.exports = (query, data = '') => {
  return new Promise((resolve, reject) => {
    db.query(query, data, (err, results, _fields) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}
