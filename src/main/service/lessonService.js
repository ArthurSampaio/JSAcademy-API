(function () {
  'use strict';

  var mongoose = require('mongoose');
  var _ = require('../util/util');
  var Lesson = mongoose.model('Lesson');

  /**
   * Service that handles operations involving exercises.
   */
  var LessonService = {};


  LessonService.getLessons = function (raw) {
    var rawLessons = Lesson.find({}).exec();

    return rawLessons.then(function (lesson) {
      if (!lesson) {
        throw Error("No exercise founded.");
      }
      return raw ?
        rawLessons : _.map(lesson, function (e) {
          return e.toObject();
        })
    });
  };

  LessonService.getLesson = function (lessonId, raw) {
    var params = {
      _id: lessonId
    };

    var rawLesson = Lesson.findOne(params)
      .populate('exercises')
      .exec();
    return rawLesson.then(function (exc) {
      if (!exc) {
        throw Error("There's no exercise with the given ID: " + lessonId);
      }
      return raw ? rawLesson : exc.toObject();
    });
  };

  LessonService.createLesson = function (lessonData) {

    return new Lesson(lessonData).save().then(function (saved) {
      return saved.toObject();
    });
  };


  module.exports = LessonService;
})();
