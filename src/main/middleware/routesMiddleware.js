;(function() {
  'use strict'

  var _ = require('../util/util')
  var passport = require('../auth/passport')

  var tokenRouter = require('../router/tokenRouter')
  var userRouter = require('../router/userRouter')
  var exerciseRouter = require('../router/exerciseRouter')
  var lessonRouter = require('../router/lessonRouter')

  var routesMiddleware = {}

  /**
   * Configure application routes.
   * @param {Object} app Express application.
   */
  routesMiddleware.set = function(app) {
    app.use('/api/token', tokenRouter)
    app.use('/api/user', userRouter)
    app.use('/api/exercise', exerciseRouter)
    app.use('/api/lesson', lessonRouter)
    // app.use('/api/organization', passport.authenticate('jwt', { session: false }), organizationRouter);
  }

  module.exports = routesMiddleware
})()
