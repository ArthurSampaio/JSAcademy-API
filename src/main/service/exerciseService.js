;(function() {
  'use strict'

  var mongoose = require('mongoose')
  var _ = require('../util/util')
  var Exercise = mongoose.model('Exercise')

  /**
   * Service that handles operations involving exercises.
   */
  var ExerciseService = {}

  ExerciseService.getExercises = function(raw) {
    var rawExercises = Exercise.find({}).exec()

    return rawExercises.then(function(ex) {
      if (!ex) {
        throw Error('No exercise founded.')
      }
      return raw
        ? rawExercises
        : _.map(ex, function(e) {
            return e.toObject()
          })
    })
  }

  ExerciseService.getExercise = function(exerciseId, raw) {
    var params = {
      _id: exerciseId,
    }

    var rawExercise = Exercise.findOne(params).exec()
    return rawExercise.then(function(exc) {
      if (!exc) {
        throw Error("There's no exercise with the given ID: " + exerciseId)
      }
      return raw ? rawExercise : exc.toObject()
    })
  }

  ExerciseService.createExercises = function(exercisesData, userId) {
    const exercise = {
      ...exercisesData,
      owner: userId,
    }
    return new Exercise(exercise).save().then(function(saved) {
      return saved.toObject()
    })
  }

  ExerciseService.update = function(exerciseId, exercise) {
    return ExerciseService.getExercise(exerciseId, true).then(function(
      exerciseDb
    ) {
      _.copyModel(exerciseDb, exercise)
      return exerciseDb.save().then(function(persistedExercise) {
        return persistedExercise.toObject()
      })
    })
  }

  module.exports = ExerciseService
})()
