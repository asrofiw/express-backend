const { APP_URL } = process.env
const response = require('../helpers/response')
const {
  getUserByConditionModel,
  getUserModel,
  getCustomerDetailModel,
  updateUserAccessModel,
  updateUserDetailModel,
  deleteUserModel,
  createUserAddressModel,
  updateUserAddressModel,
  getUserAddressModel,
  getSellerDetailModel,
  createUserBalanceModel,
  topUpBalanceModel,
  getBalanceModel,
  getDetailBalanceModel
} = require('../models/userModel')
const joi = require('joi')
const bcrypt = require('bcryptjs')

module.exports = {
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
  getCustomerDetail: async (req, res) => {
    const { id } = req.user
    const roleId = req.user.role_id
    if (roleId === 3) {
      try {
        const result = await getCustomerDetailModel(id)
        if (result.length) {
          const data = result.map(item => {
            return {
              id: item.user_id,
              name: item.name,
              email: item.email,
              phone: item.phone_number,
              gender: item.gender,
              dateOfBirth: item.date_of_birth,
              image: item.image
            }
          })
          let { image } = data[0]

          if (image === null) {
            image = null
          } else {
            image = APP_URL.concat(image)
          }

          data[0] = {
            ...data[0],
            image: image
          }
          return response(res, `Detail user with id ${id}`, 200, true, { data })
        } else {
          return response(res, `User with ID ${id} not found`, 404, false)
        }
      } catch (err) {
        return response(res, 'Internal server error', 500, false)
      }
    } else {
      return response(res, 'Forbidden Access', 401, false)
    }
  },
  getSellerDetail: async (req, res) => {
    const { id } = req.user
    const roleId = req.user.role_id
    if (roleId === 2) {
      try {
        const result = await getSellerDetailModel(id)
        if (result.length) {
          const data = result.map(item => {
            return {
              id: item.user_id,
              name: item.name,
              store_name: item.store_name,
              store_description: item.store_description,
              email: item.email,
              phone: item.phone_number,
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
    } else {
      return response(res, 'Forbidden Access', 401, false)
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
    const { id } = req.user
    const roleId = req.user.role_id
    if (roleId === 3) {
      const schema = joi.object({
        name: joi.string(),
        email: joi.string(),
        phone_number: joi.string(),
        gender: joi.string(),
        date_of_birth: joi.string()
      })

      let { value: results, error } = schema.validate(req.body)

      let urlImage = ''
      if (req.file) {
        let { path } = req.file
        path = path.split('\\')
        path.shift()
        path = path.join('/')
        urlImage = path
        results = {
          ...results,
          image: urlImage
        }
      } else {
        urlImage = undefined
      }
      if (error) {
        return response(res, 'Error', 400, false, { error: error.message })
      } else {
        const { email } = results
        if (email) {
          const isExists = await getUserByConditionModel({ email })
          if (isExists.length > 0) {
            return response(res, 'Email already used', 400, false)
          } else {
            try {
              const updateAccess = await updateUserAccessModel(id, { email })
              if (!updateAccess.affectedRows) {
                return response(res, 'Failed to update email', 404, false)
              }
            } catch (err) {
              return response(res, 'Internal server error \'update userAccess\'', 500, false)
            }
          }
        }

        delete results.email
        if (Object.values(results).length > 0) {
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
        } else if (req.file === undefined) {
          return response(res, 'Failed to upload image', 400, false)
        }
        return response(res, 'Email has been updated')
      }
    } else {
      return response(res, 'Forbidden Access', 401, false)
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
  createCustomerAddress: async (req, res) => {
    const { id } = req.user
    const roleId = req.user.role_id
    if (roleId === 3) {
      const schema = joi.object({
        address_as: joi.string().required(),
        recipients_name: joi.string().required(),
        recipients_phone: joi.string().required(),
        address: joi.string().required(),
        city: joi.string().required(),
        postal_code: joi.string().required(),
        isPrimary: joi.string().required()
      })

      let { value: results, error } = schema.validate(req.body)
      if (error) {
        return response(res, 'All field should be filled', 401, false, { error: error.message })
      } else {
        try {
          let { isPrimary } = results
          if (isPrimary === 'true') {
            isPrimary = true
          } else if (isPrimary === 'false') {
            isPrimary = false
          } else {
            return response(res, 'isPrimary should be true or false', 400, false)
          }

          results = {
            ...results,
            isPrimary: isPrimary,
            user_id: id
          }
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
    } else {
      return response(res, 'Forbidden Access', 401, false)
    }
  },
  updateCustomerAddress: async (req, res) => {
    const { id } = req.params
    const roleId = req.user.role_id
    if (roleId === 3) {
      const schema = joi.object({
        address_as: joi.string(),
        recipients_name: joi.string(),
        recipients_phone: joi.string(),
        address: joi.string(),
        city: joi.string(),
        postal_code: joi.string(),
        isPrimary: joi.string()
      })
      let { value: results, error } = schema.validate(req.body)
      if (error) {
        return response(res, 'Error', 401, false, { error: error.message })
      } else {
        try {
          let { isPrimary } = results
          if (isPrimary === 'true') {
            isPrimary = true
          } else if (isPrimary === 'false') {
            isPrimary = false
          } else {
            return response(res, 'isPrimary should be true or false', 400, false)
          }

          results = {
            ...results,
            isPrimary: isPrimary
          }
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
    } else {
      return response(res, 'Forbidden Access', 401, false)
    }
  },
  getCustomerAddress: async (req, res) => {
    const { id } = req.user
    const roleId = req.user.role_id
    if (roleId === 3) {
      try {
        const result = await getUserAddressModel(id)
        if (result.length) {
          return response(res, 'Shipping Address', 200, true, { result })
        } else {
          return response(res, 'Failed to get Shipping Address, Not Found', 404, false)
        }
      } catch (err) {
        return response(res, 'Internal server error \'get user address\'', 500, false)
      }
    } else {
      return response(res, 'Forbidden Access', 401, false)
    }
  },
  updateUserSeller: async (req, res) => {
    const { id } = req.user
    const roleId = req.user.role_id
    if (roleId === 2) {
      const schema = joi.object({
        name: joi.string(),
        store_name: joi.string(),
        store_description: joi.string(),
        email: joi.string(),
        phone_number: joi.string()
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
                return response(res, 'Failed to update email', 404, false)
              }
            } catch (err) {
              return response(res, 'Internal server error \'update userAccess\'', 500, false)
            }
          }
        }

        delete results.email
        if (Object.values(results).length > 0) {
          try {
            const data = await updateUserDetailModel(id, results)
            if (data.affectedRows) {
              return response(res, 'Data has been updated')
            } else {
              return response(res, `User with id ${id} not found`, 404, false)
            }
          } catch (err) {
            return response(res, 'Internal server error \'update userDetail\'', 500, false)
          }
        }
        return response(res, 'Email has been updated')
      }
    } else {
      return response(res, 'Forbidden Access', 401, false)
    }
  },
  createUserBalance: async (req, res) => {
    const { id } = req.user
    const roleId = req.user.role_id
    if (roleId === 3) {
      const schema = joi.object({
        payment_method: joi.string().required(),
        balance: joi.string().required()
      })
      const { value, error } = schema.validate(req.body)
      if (error) {
        return response(res, 'Error', 401, false, { error: error.message })
      }
      const results = {
        ...value,
        user_id: id
      }
      try {
        const createBalance = await createUserBalanceModel(results)
        if (createBalance.affectedRows) {
          return response(res, 'Balance has created', 200, true, { value })
        } else {
          return response(res, 'Failed to create balance', 400, false)
        }
      } catch (err) {
        return response(res, 'Internal server error \'create balance\'')
      }
    } else {
      return response(res, 'Forbidden Access', 401, false)
    }
  },
  topUpBalance: async (req, res) => {
    const { id } = req.user
    const roleId = req.user.role_id
    if (roleId === 3) {
      const schema = joi.object({
        payment_method: joi.string().required(),
        top_up: joi.string().required()
      })
      const { value, err } = schema.validate(req.body)
      if (err) {
        return response(res, 'Error', 400, false, { error: err.message })
      }
      try {
        const paymentMethod = value.payment_method
        const getBalance = await getBalanceModel(id, paymentMethod)
        if (getBalance.length) {
          const results = {
            balance: parseInt(getBalance[0].balance) + parseInt(value.top_up)
          }
          try {
            const topup = await topUpBalanceModel(results, id)
            if (topup.affectedRows) {
              return response(res, 'Top Up Succes', 200, true, { results })
            }
          } catch (err) {
            return response(res, 'Internal server error \'topup balance\'', 500, false)
          }
        } else {
          return response(res, 'Failed to get balance', 400, false)
        }
      } catch (err) {
        return response(res, 'Internal server error \'\'', 500, false)
      }
    } else {
      return response(res, 'Forbidden Access', 401, false)
    }
  },
  getBalance: async (req, res) => {
    const { id } = req.user
    const roleId = req.user.role_id
    if (roleId === 3) {
      try {
        const getBalance = await getDetailBalanceModel(id)
        if (getBalance.length) {
          const data = {
            payment_method: getBalance[0].payment_method,
            balance: getBalance[0].balance
          }
          return response(res, 'Your remaining Balance', 200, true, { data })
        } else {
          return response(res, 'Failed to get Balance. Not Found', 404, false)
        }
      } catch (err) {
        return response(res, 'Internal server error \'get balance\'', 500, false)
      }
    } else {
      return response(res, 'Forbidden Access', 401, false)
    }
  }
}
