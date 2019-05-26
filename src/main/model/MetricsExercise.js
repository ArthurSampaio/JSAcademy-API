;(function() {
  'use strict'

  var mongoose = require('mongoose')
  var Schema = mongoose.Schema

  var MetricsExerciseSchema = new Schema(
    {
      attempts: {
        type: Number,
        default: 0,
      },
      exercise: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
      },
      time: {
        type: Number,
      },
    },
    {
      timestamps: true,
    }
  )

  mongoose.model('MetricsExercise', MetricsExerciseSchema)

  module.exports = MetricsExerciseSchema
})()
