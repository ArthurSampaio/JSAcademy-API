;(function() {
  'use strict'

  const jwt = require('jsonwebtoken')

  const jwtMiddleware = (req, res, next) => {
    const SECRET_KEY = process.env.SECRET
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1]

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        req.user = null
      } else {
        req.user = decoded
      }
      next()
    })
  }

  module.exports = jwtMiddleware
})()
