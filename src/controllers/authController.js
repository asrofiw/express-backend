const jwt = require('jsonwebtoken')
const response = require('../helpers/response')
const joi = require('joi')
const bcrypt = require('bcryptjs')
const {
  getUserByConditionModel,
  getUserRoleByConditionModel,
  createUserDetailModel,
  createUserModel
} = require('../models/userModel')

module.exports = {
  createUserCustomer: async (req, res) => {
    try {
      const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
      })
      let { value: results, error } = schema.validate(req.body)

      if (error) {
        return response(res, 'Oops! You have to fill all form for register!', 401, false, { error: error.message })
      } else {
        const { email, password } = results
        const isExists = await getUserByConditionModel({ email })
        if (isExists.length > 0) {
          return response(res, 'Email already used', 401, false)
        } else {
          const userCostumer = {
            name: results.name,
            role_id: 3
          }
          const userDetail = await createUserDetailModel(userCostumer)
          if (userDetail.affectedRows) {
            const id = userDetail.insertId
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            results = {
              ...results,
              password: hashedPassword
            }
            const data = await createUserModel([id, email, hashedPassword])
            if (data.affectedRows) {
              results = {
                id: id,
                ...results,
                password: undefined
              }
              return response(res, 'Congratulation! Now you have an account!', 200, true, { results })
            } else {
              return response(res, 'Failed to create user access', 401, false)
            }
          }
        }
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false, { error: err.message })
    }
  },

  createUserSeller: async (req, res) => {
    try {
      const schema = joi.object({
        name: joi.string().required(),
        store_name: joi.string().required(),
        email: joi.string().required(),
        phone_number: joi.string().required(),
        password: joi.string().required()
      })

      let { value: results, error } = schema.validate(req.body)

      if (error) {
        return response(res, 'Error', 401, false, { error: error.message })
      } else {
        const { email, password } = results
        const isExists = await getUserByConditionModel({ email })
        if (isExists.length > 0) {
          return response(res, 'Email already used', 401, false)
        } else {
          const userSeller = {
            name: results.name,
            store_name: results.store_name,
            phone_number: results.phone_number,
            role_id: 2
          }
          const userDetail = await createUserDetailModel(userSeller)
          if (userDetail.affectedRows) {
            const id = userDetail.insertId
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            results = {
              ...results,
              password: hashedPassword
            }
            const data = await createUserModel([id, email, hashedPassword])
            if (data.affectedRows) {
              results = {
                id: id,
                ...results,
                password: undefined
              }
              return response(res, 'Register as a Seller successfully', 200, true, { results })
            } else {
              return response(res, 'Failed to create user access', 401, false)
            }
          }
        }
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false, { error: err.message })
    }
  },

  loginController: async (req, res) => {
    try {
      const schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
      })
      const { value, error } = schema.validate(req.body)
      if (error) {
        return response(res, 'Login Failed', 401, false)
      }

      const { email, password } = value
      const data = await getUserByConditionModel({ email })
      if (data.length === 1) {
        const user = data[0]
        const pass = bcrypt.compareSync(password, user.password)
        if (pass) {
          const getRole = await getUserRoleByConditionModel({ id: user.user_id })
          const token = jwt.sign({ id: user.user_id, role_id: getRole[0].role_id }, 'KODERAHASIA')
          return response(res, 'Login Successfully', 200, true, { token })
        } else {
          return response(res, 'Wrong password', 400, false)
        }
      } else {
        return response(res, 'Wrong email', 400, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false, { error: err.message })
    }
  }
}
