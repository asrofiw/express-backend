const jwt = require('jsonwebtoken')
const response = require('../helpers/response')
const { getUserByConditionModel } = require('../models/userModel')

module.exports = {
  loginController: async (req, res) => {
    const { email, password } = req.body
    const credentials = {
      email,
      password
    }
    try {
      console.log(credentials)
      const data = await getUserByConditionModel({ email })
      console.log(data)
      if (data.length) {
        jwt.sign({ id: data.id }, 'KODERAHASIA', (_err, token) => {
          return response(res, `Token ${token}`)
        })
      } else {
        return response(res, 'Wrong email or password', 400, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  }
}
