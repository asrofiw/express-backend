const response = require('../helpers/response')
const { createUserModel, getUserByConditionModel, getUserModel, createUserDetailModel, getUserDetailModel, updateUserAccessModel, updateUserDetailModel, deleteUserModel } = require('../models/userModel')
const joi = require('joi')
const bcrypt = require('bcryptjs')

module.exports = {
  createUser: async (req, res) => {
    const schema = joi.object({
      name: joi.string().required(),
      phone: joi.string().required(),
      gender: joi.string().required(),
      address: joi.string().required(),
      dateOfBirth: joi.string().required(),
      roleId: joi.string().required(),
      email: joi.string().required(),
      password: joi.string().required()
    })

    let { path } = req.file
    path = path.split('\\')
    path.shift()
    path = path.join('/')

    const urlImage = process.env.APP_URL.concat(path)
    let { value: results, error } = schema.validate(req.body)

    if (error) {
      return response(res, 'Error', 401, false, { error: error.message })
    } else {
      const { email, password } = results
      const isExists = await getUserByConditionModel({ email })
      if (isExists.length > 0) {
        return response(res, 'Email already used', 401, false)
      } else {
        try {
          const { name, phone, gender, address, dateOfBirth, roleId } = results
          const userDetail = await createUserDetailModel([name, phone, gender, address, dateOfBirth, roleId, urlImage])
          if (userDetail.affectedRows) {
            const id = userDetail.insertId
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            results = {
              ...results,
              password: hashedPassword
            }
            try {
              const data = await createUserModel([id, email, hashedPassword])
              if (data.affectedRows) {
                results = {
                  id: id,
                  ...results,
                  image: urlImage,
                  password: undefined
                }
                return response(res, 'Create user successfully', 200, true, { results })
              } else {
                return response(res, 'Failed to create user', 401, false)
              }
            } catch (err) {
              console.log(err)
              return response(res, 'Internal server error', 500, false)
            }
          }
        } catch (err) {
          console.log(err)
          return response(res, 'Internal server error', 500, false)
        }
      }
    }
  },
  getUser: async (req, res) => {
    let { page, limit } = req.query

    if (!limit) {
      limit = 5
    } else {
      limit = parseInt(limit)
    }

    if (!page) {
      page = 1
    } else {
      page = parseInt(page)
    }
    // const offset = (page - 1) * limit
    try {
      const result = await getUserModel()
      if (result.length) {
        const data = result.map(element => {
          return {
            user_id: element.user_id,
            name: element.name,
            email: element.email
          }
        })

        return response(res, 'List of User', 200, true, { data })
      } else {
        return response(res, 'Failed to get List of User', 400, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  },
  getDetailUser: async (req, res) => {
    const { id } = req.params
    try {
      const result = await getUserDetailModel(id)
      if (result.length) {
        const data = result.map(item => {
          return {
            id: item.user_id,
            name: item.name,
            phone: item.phone_number,
            gender: item.gender,
            address: item.address,
            email: item.email,
            image: item.image
          }
        })
        return response(res, `Detail user with id ${id}`, 200, true, { data })
      } else {
        return response(res, `User with ID ${id} not found`, 404, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  },
  updateUserAccess: async (req, res) => {
    const { id } = req.params
    const schema = joi.object({
      email: joi.string(),
      password: joi.string()
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
        if (password) {
          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(password, salt)
          results = {
            ...results,
            password: hashedPassword
          }
        }
        try {
          const data = await updateUserAccessModel(id, results)
          if (data.affectedRows) {
            return response(res, 'Data user has been change')
          } else {
            return response(res, `User with id ${id} not found`, 404, false)
          }
        } catch (err) {
          return response(res, 'Internal server error', 500, false)
        }
      }
    }
  },
  updateUserDetail: async (req, res) => {
    const { id } = req.params
    const schema = joi.object({
      name: joi.string(),
      phone_number: joi.string(),
      address: joi.string()
    })
    const { value: results, error } = schema.validate(req.body)
    if (error) {
      return response(res, 'Error', 401, false, { error: error.message })
    } else {
      try {
        console.log(results)
        const data = await updateUserDetailModel(id, results)
        if (data.affectedRows) {
          return response(res, 'Data user has been change')
        } else {
          return response(res, `User with id ${id} not found`, 404, false)
        }
      } catch (err) {
        console.log(err)
        return response(res, 'Internal server error', 500, false)
      }
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params
    try {
      const result = await deleteUserModel(id)
      if (result.affectedRows) {
        return response(res, 'Data deleted')
      } else {
        return response(res, `User with id ${id} not found`, 404, false)
      }
    } catch (err) {
      return response(res, 'Internal server error', 500, false)
    }
  }
}
