;(function() {
  'use strict'

  var express = require('express')
  var _ = require('../util/util')
  var jwt = require('jsonwebtoken')
  var jwtMiddleware = require('../middleware/jwtMiddleware')

  var LessonService = require('../service/lessonService')
  var UserService = require('../service/userService')

  /**
   * Router used to access the Exercise entity.
   * URL: /api/exercise
   */
  var lessonRouter = express.Router()

  lessonRouter.get(['', '/'], function(req, res) {
    return LessonService.getLessons()
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  lessonRouter.get('/:exerciseId', jwtMiddleware, async function(req, res) {
    console.log('>>>>>>>>>>>>>>>>>>>>>a', req.user)
    const userId = (req.user && req.user._id) || req.user
    let anonymous
    if (!userId) {
      anonymous = await UserService.createAnonymousUser()
    }

    return LessonService.getLessonToStudy(req.params.exerciseId, userId)
      .then(function(response) {
        if (anonymous) {
          res.setHeader('anonymous-id', anonymous._id) //works fine
        }
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  lessonRouter.post('/send', function(req, res) {
    return LessonService.createMetricsLesson(req.body)
      .then(function(response) {
        return res.status(_.CREATED).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  lessonRouter.post(['', '/'], function(req, res) {
    return LessonService.createLesson(req.body)
      .then(function(response) {
        return res.status(_.CREATED).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  module.exports = lessonRouter
})()
