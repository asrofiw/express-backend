const db = require('./db')

module.exports = (query) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, results, _fields) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}