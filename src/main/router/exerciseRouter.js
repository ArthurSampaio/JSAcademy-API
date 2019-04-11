(function () {
  'use strict';

  var express = require('express');
  var _ = require('../util/util');


  var ExerciseService = require('../service/exerciseService');

  /**
   * Router used to access the user entity.
   * URL: /api/user
   */
  var exerciseRouter = express.Router();

  exerciseRouter.get(['', '/'], function (req, res) {
    return ExerciseService.getExercises().then(function (response) {
      return res.status(_.OK).json(response);
    }).catch(function (error) {
      return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
    });
  });

  exerciseRouter.get('/:exerciseId', function (req, res) {
    return ExerciseService.getExercises(req.params.exerciseId).then(function (response) {
      return res.status(_.OK).json(response);
    }).catch(function (error) {
      return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
    });
  });

  exerciseRouter.post(['', '/'], function (req, res) {
    return ExerciseService.createExercises(req.body)
      .then(function (response) {
        return res.status(_.CREATED).json(response);
      })
      .catch(function (error) {
        return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
      });
  });

  module.exports = exerciseRouter;
})();
