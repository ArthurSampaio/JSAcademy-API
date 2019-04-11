(function () {
  'use strict';

  var mongoose = require('mongoose');
  var _ = require('../util/util');
  var Module = mongoose.model('Exercise');

  /**
   * Service that handles operations involving exercises.
   */
  var ExerciseService = {};


  ExerciseService.getExercises = function (raw) {
    var rawExercises = Exercise.find({}).exec();

    return rawExercises.then(function (ex) {
      if (!ex) {
        throw Error("No modules founded.");
      }
      return raw ?
        rawExercises : _.map(ex, function (e) {
          return e.toObject();
        })
    });
  };

  ExerciseService.getExercises = function (exerciseId, raw) {
    var params = {
      _id: exerciseId
    };

    var rawExercise = Exercise.findOne(params).exec();
    return rawExercise.then(function (exc) {
      if (!exc) {
        throw Error("There's no module with the given ID: " + moduleId);
      }
      return raw ? rawExercise : exc.toObject();
    });
  };

  ExerciseService.createExercises = function (exercisesData) {

    return new Exercise(exercisesData).save().then(function (saved) {
      return saved.toObject();
    });
  };


  module.exports = ExerciseService;
})();
