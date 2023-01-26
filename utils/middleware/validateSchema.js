const joi = require('joi')
const { badRequest } = require('../errors')

module.exports = (schema, type) => {
  return (req, res, next) => {
    if (!joi.isSchema(schema)) {
      const error = badRequest('First param is not a valid schema for Joi')
      return res.status(error.statusCode).json(error.payload)
    }
    const results =  schema.validate(req[type])
    if(results?.error) {
      const message = results.error
      const error = badRequest(message)
      return res.status(error.statusCode).json(error.payload)
    }
    next()
  }
}