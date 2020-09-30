const response = require('../helpers/response')
const {
  createUserModel,
  getUserByConditionModel,
  getUserModel,
  createUserDetailModel,
  getUserDetailModel,
  updateUserAccessModel,
  updateUserDetailModel,
  deleteUserModel,
  createUserAddressModel,
  updateUserAddressModel
} = require('../models/userModel')
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
    let urlImage = process.env.APP_URL
    if (req.file) {
      let { path } = req.file
      path = path.split('\\')
      path.shift()
      path = path.join('/')
      urlImage = urlImage.concat(path)
    } else {
      urlImage = ''
    }
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
          const { name, phone, gender, dateOfBirth, roleId } = results
          const userDetail = await createUserDetailModel([name, phone, gender, dateOfBirth, roleId, urlImage])
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
                return response(res, 'Failed to create user access', 401, false)
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
      email: joi.string(),
      phone: joi.string(),
      gender: joi.string(),
      dateOfBirth: joi.string()
    })
    let { value: results, error } = schema.validate(req.body)

    let urlImage = process.env.APP_URL
    if (req.file) {
      let { path } = req.file
      path = path.split('\\')
      path.shift()
      path = path.join('/')
      urlImage = urlImage.concat(path)
      results = {
        ...results,
        image: urlImage
      }
    } else {
      urlImage = ''
    }

    if (error) {
      return response(res, 'Error', 401, false, { error: error.message })
    } else {
      const { email } = results
      if (email) {
        const isExists = await getUserByConditionModel({ email })
        if (isExists.length > 0) {
          return response(res, 'Email already used', 401, false)
        } else {
          try {
            const updateAccess = await updateUserAccessModel(id, { email })
            if (!updateAccess.affectedRows) {
              return response(res, 'Failed to update image', 404, false)
            }
          } catch (err) {
            return response(res, 'Internal server error \'update userAccess\'', 500, false)
          }
        }
      }
      delete results.email
      try {
        const data = await updateUserDetailModel(id, results)
        if (data.affectedRows) {
          return response(res, 'Data has been update')
        } else {
          return response(res, `User with id ${id} not found`, 404, false)
        }
      } catch (err) {
        return response(res, 'Internal server error \'update userDetail\'', 500, false)
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
  },
  createUserAddress: async (req, res) => {
    const schema = joi.object({
      address_as: joi.string().required(),
      recipients_name: joi.string().required(),
      recipients_phone: joi.string().required(),
      address: joi.string().required(),
      city: joi.string().required(),
      postal_code: joi.string().required(),
      user_id: joi.string().required()
    })

    const { value: results, error } = schema.validate(req.body)
    if (error) {
      return response(res, 'Error', 401, false, { error: error.message })
    } else {
      try {
        const userAddress = await createUserAddressModel(results)
        if (userAddress.affectedRows) {
          return response(res, 'Add shipping address successfuly', 200, true, { results })
        } else {
          return response(res, 'Failed to add user\'s shipping address', 400, false)
        }
      } catch (err) {
        return response(res, 'Internal server error \'create user address\'')
      }
    }
  },
  updateUserAddress: async (req, res) => {
    const { id } = req.params
    const schema = joi.object({
      address_as: joi.string(),
      recipients_name: joi.string(),
      recipients_phone: joi.string(),
      address: joi.string(),
      city: joi.string(),
      postal_code: joi.string()
    })
    const { value: results, error } = schema.validate(req.body)
    if (error) {
      return response(res, 'Error', 401, false, { error: error.message })
    } else {
      try {
        const data = await updateUserAddressModel(id, results)
        if (data.affectedRows) {
          return response(res, 'Update data user\'s shipping address success')
        } else {
          return response(res, 'Failed to update user\'s shipping address', 400, false)
        }
      } catch (err) {
        return response(res, 'Internal server error \'update user address\'')
      }
    }
  }
}
