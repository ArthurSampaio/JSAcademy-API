;(function() {
  'use strict'

  var mongoose = require('mongoose')
  var _ = require('../util/util')
  var Lesson = mongoose.model('Lesson')
  var MetricsLesson = mongoose.model('MetricsLesson')

  /**
   * Service that handles operations involving exercises.
   */
  var LessonService = {}

  LessonService.getLessons = function(raw) {
    var rawLessons = Lesson.find({}).exec()

    return rawLessons.then(function(lesson) {
      if (!lesson) {
        throw Error('No exercise founded.')
      }
      return raw
        ? rawLessons
        : _.map(lesson, function(e) {
            return e.toObject()
          })
    })
  }

  LessonService.getLessonToStudy = async function(lessonId, raw) {
    var lesson = await LessonService.getLesson(lessonId)
    lesson.viewed = lesson.viewed + 1
    return LessonService.update(lessonId, lesson)
  }

  LessonService.createLesson = function(lessonData) {
    return new Lesson(lessonData).save().then(function(saved) {
      return saved.toObject()
    })
  }

  LessonService.update = function(lessonId, lesson) {
    return LessonService.getLesson(lessonId, true).then(function(lessonDb) {
      _.copyModel(lessonDb, lesson)

      return lessonDb.save().then(function(persistedLesson) {
        return persistedLesson.toObject()
      })
    })
  }

  LessonService.getLesson = function(lessonId, raw) {
    var params = {
      _id: lessonId,
    }

    var rawLesson = Lesson.findOne(params)
      .populate('exercises')
      .exec()
    return rawLesson.then(function(exc) {
      if (!exc) {
        throw Error("There's no exercise with the given ID: " + lessonId)
      }
      return raw ? rawLesson : exc.toObject()
    })
  }

  LessonService.getMetricById = function(metricsId, raw) {
    var params = {
      _id: metricsId,
    }

    var rawMetrics = MetricsLesson.findOne(params).exec()
    return rawMetrics.then(function(exc) {
      if (!exc) {
        throw Error("There's no exercise with the given ID: " + metricsId)
      }
      return raw ? rawMetrics : exc.toObject()
    })
  }

  LessonService.getMetrics = function(raw) {
    var rawLessons = MetricsLesson.find({}).exec()

    return rawLessons.then(function(lesson) {
      if (!lesson) {
        throw Error('No metrics founded.')
      }
      return raw
        ? rawLessons
        : _.map(lesson, function(e) {
            return e.toObject()
          })
    })
  }

  LessonService.createMetricsLesson = function(metricsData) {
    return new MetricsLesson(metricsData).save().then(function(saved) {
      return saved.toObject()
    })
  }

  module.exports = LessonService
})()
