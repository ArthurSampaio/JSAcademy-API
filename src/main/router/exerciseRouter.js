;(function() {
  'use strict'

  var express = require('express')
  var _ = require('../util/util')
  var jwtMiddleware = require('../middleware/jwtMiddleware')

  var ExerciseService = require('../service/exerciseService')

  /**
   * Router used to access the Exercise entity.
   * URL: /api/exercise
   */
  var exerciseRouter = express.Router()

  exerciseRouter.get(['', '/'], function(req, res) {
    return ExerciseService.getExercises()
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  exerciseRouter.get('/:exerciseId', function(req, res) {
    return ExerciseService.getExercise(req.params.exerciseId)
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  exerciseRouter.post(['', '/'], jwtMiddleware, function(req, res) {
    const userId = (req.user && req.user._id) || req.user

    return ExerciseService.createExercises(req.body, userId)
      .then(function(response) {
        return res.status(_.CREATED).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  exerciseRouter.put('/:exerciseId', function(req, res) {
    return ExerciseService.update(req.params.exerciseId, req.body)
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  module.exports = exerciseRouter
})()
