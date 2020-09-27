const jwt = require('jsonwebtoken')
const response = require('../helpers/response')

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.slice(7, authorization.length)
    try {
      if (jwt.verify(token, 'KODERAHASIA')) {
        next()
      } else {
        return response(res, 'Unauthorize', 401, false)
      }
    } catch (err) {
      return response(res, err.message, 500, false)
    }
  } else {
    return response(res, 'Forbidden access', 403, false)
  }
}
