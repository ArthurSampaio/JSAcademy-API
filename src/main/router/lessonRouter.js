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

  lessonRouter.get(['', '/'], jwtMiddleware, function(req, res) {
    const userId = (req.user && req.user._id) || req.user

    return LessonService.getLessons()
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return error
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  lessonRouter.get('/study', jwtMiddleware, function(req, res) {
    const userId = (req.user && req.user._id) || req.user

    return LessonService.getLessonForStudy(userId)
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return (
          error &&
          error
            .status(error.status || _.BAD_REQUEST)
            .json(error.message || error)
        )
      })
  })

  function getLessons(cb) {
    return cb
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return error
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  }

  lessonRouter.get('/my', jwtMiddleware, async function(req, res) {
    const userId = (req.user && req.user._id) || req.user

    return LessonService.getLessonsByUserId(userId)
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  lessonRouter.get('/metrics', function(req, res) {
    const lessonId = req.query.lessonId
    return LessonService.getMetrics(lessonId)
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  lessonRouter.get('/metrics/:metricsId', jwtMiddleware, async function(
    req,
    res
  ) {
    return LessonService.getMetricById(req.params.metricsId)
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

  lessonRouter.post('/send', jwtMiddleware, function(req, res) {
    //TODO: logica para pegar se o anonymousId se o req.user for null (nao autenticado)
    const userId = (req.user && req.user._id) || req.user
    let isAnonymous = false

    if (!userId) {
      isAnonymous = true
    }
    return LessonService.createMetricsLesson(req.body, userId, isAnonymous)
      .then(function(response) {
        return res.status(_.CREATED).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  lessonRouter.post(['', '/'], jwtMiddleware, function(req, res) {
    const userId = (req.user && req.user._id) || req.user

    return LessonService.createLesson(req.body, userId)
      .then(function(response) {
        return res.status(_.CREATED).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  lessonRouter.put('/:lessonId', function(req, res) {
    return LessonService.update(req.params.lessonId, req.body)
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
