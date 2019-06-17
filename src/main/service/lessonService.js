;(function() {
  'use strict'

  var mongoose = require('mongoose')
  var _ = require('../util/util')
  var Lesson = mongoose.model('Lesson')
  var MetricsLesson = mongoose.model('MetricsLesson')
  var UserService = require('./userService')

  /**
   * Service that handles operations involving exercises.
   */
  var LessonService = {}

  LessonService.getLessons = function(raw) {
    var rawLessons = Lesson.find({})
      .sort({ createdAt: -1 })
      .exec()

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

  LessonService.createLesson = function(lessonData, userId) {
    const lesson = {
      ...lessonData,
      owner: userId,
    }
    return new Lesson(lesson).save().then(function(saved) {
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

  LessonService.getLessonForStudy = async function(userId, raw) {
    if (!userId) {
      return LessonService.getLessons()
    }
    const user = await UserService.getUser(userId)
    const answeredLesson = user.answeredLesson.map(
      answer => answer.lesson && answer.lesson._id.toString()
    )
    const lessons = await LessonService.getLessons()

    const filteredLessons = lessons.filter(lesson => {
      return !(
        answeredLesson.includes(lesson._id.toString()) ||
        (lesson.owner && lesson.owner.equals(userId))
      )
    })
    return filteredLessons
  }

  LessonService.getLesson = async function(lessonId, raw) {
    var params = {
      _id: lessonId,
    }

    var rawLesson = Lesson.findOne(params)
      .populate('exercises')
      .exec()
    return rawLesson.then(function(exc) {
      if (!exc) {
        throw Error("There's no lesson with the given ID: " + lessonId)
      }
      return raw ? rawLesson : exc.toObject()
    })
  }

  LessonService.getLessonsByUserId = async function(userId, raw) {
    var params = {
      owner: userId,
    }
    var rawLessons = Lesson.find(params)
      .sort({ createdAt: -1 })
      .populate('exercises')
      .exec()

    return rawLessons.then(function(lesson) {
      if (!lesson) {
        throw Error("There's no lesson with the given UserId: " + userId)
      }
      return raw
        ? rawLessons
        : _.map(lesson, function(e) {
            return e.toObject()
          })
    })
  }

  LessonService.improveAnsweredInLesson = async function(lessonId) {
    const lesson = await LessonService.getLesson(lessonId)
    lesson.answered = lesson.answered + 1
    return LessonService.update(lessonId, lesson)
  }

  LessonService.createMetricsLesson = async function(
    metricsData,
    userId,
    isAnonymous
  ) {
    const lesson = await LessonService.improveAnsweredInLesson(
      metricsData.lesson
    )
    const metricObj = metricDataToObj(metricsData, userId, isAnonymous)

    return LessonService.saveMetricsLesson(metricObj).then(function(metric) {
      if (!isAnonymous) return LessonService.linkingMetricToUser(metric, userId)
    })
  }

  LessonService.linkingMetricToUser = function(metric, userId) {
    return UserService.linkingMetricToUser(metric, userId)
  }

  function metricDataToObj(metricData, userId, isAnonymous) {
    const totalTime = metricData.exercisesMetrics.reduce(
      (acc, val) => (acc = acc + val.time),
      0
    )
    const baseObj = {
      ...metricData,
      totalTime: totalTime,
      userId: userId,
    }
    return isAnonymous ? baseObj : { ...baseObj, owner: userId }
  }

  LessonService.saveMetricsLesson = function(metricsData) {
    return new MetricsLesson(metricsData).save().then(function(saved) {
      return saved.toObject()
    })
  }

  LessonService.getMetricById = function(metricsId, raw) {
    var params = {
      _id: metricsId,
    }

    var rawMetrics = MetricsLesson.findOne(params)
      .populate('exercisesMetrics.exercise')
      .populate('lesson')
      .exec()
    return rawMetrics.then(function(exc) {
      if (!exc) {
        throw Error("There's no exercise with the given ID: " + metricsId)
      }
      return raw ? rawMetrics : exc.toObject()
    })
  }

  LessonService.getMetrics = function(lessonId, raw) {
    var params = lessonId
      ? {
          lesson: lessonId,
        }
      : {}

    var rawLessons = MetricsLesson.find(params)
      .sort({ createdAt: -1 })
      .populate('owner')
      .exec()

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

  module.exports = LessonService
})()
