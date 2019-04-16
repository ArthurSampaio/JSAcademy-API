(function () {
  'use strict';

  var express = require('express');
  var _ = require('../util/util');


  var LessonService = require('../service/lessonService');

  /**
   * Router used to access the Exercise entity.
   * URL: /api/exercise
   */
  var lessonRouter = express.Router();


  lessonRouter.get(['', '/'], function (req, res) {
    return LessonService.getLessons().then(function (response) {
      return res.status(_.OK).json(response);
    }).catch(function (error) {
      return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
    });
  });

  lessonRouter.get('/:exerciseId', function (req, res) {
    return LessonService.getLesson(req.params.exerciseId).then(function (response) {
      return res.status(_.OK).json(response);
    }).catch(function (error) {
      return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
    });
  });

  lessonRouter.post(['', '/'], function (req, res) {
    return LessonService.createLesson(req.body)
      .then(function (response) {
        return res.status(_.CREATED).json(response);
      })
      .catch(function (error) {
        return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
      });
  });

  module.exports = lessonRouter;
})();
