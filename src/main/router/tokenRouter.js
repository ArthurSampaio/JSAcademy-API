;(function() {
  'use strict'

  var express = require('express')
  var passport = require('passport')
  var jwt = require('jsonwebtoken')
  var _ = require('../util/util')

  /**
   * Router used to access the token entity.
   * URL: /api/token
   */
  var tokenRouter = express.Router()

  /**
   * POST /api/token
   * Validates the user's info and authenticates him/her if everything is correct.
   * @returns {Promise} Promise with a signed JWT.
   */
  tokenRouter.post(['', '/'], function(req, res) {
    passport.authenticate('local', { session: false }, function(
      err,
      user,
      info
    ) {
      if (err || !user) {
        return res.status(404).json({
          message:
            (!_.isNil(err) && err.message) ||
            info ||
            'O login falhou. Favor tentar novamente.',
        })
      }

      req.login(user, { session: false }, function(err) {
        if (err) {
          res.send(err)
        }
        var token = jwt.sign(user, process.env.SECRET, { expiresIn: '7d' })
        return res.json({ token: token })
      })
    })(req, res)
  })

  module.exports = tokenRouter
})()
