;(function() {
  'use strict'

  var mongoose = require('mongoose')
  var Schema = mongoose.Schema
  var MetricsExerciseSchema = require('./MetricsExercise')

  var MetricsLessonSchema = new Schema(
    {
      lesson: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      },
      userId: {
        type: String,
      },
      owner: {
        //who answered
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      totalTime: {
        type: Number,
      },
      exercisesMetrics: [
        {
          type: MetricsExerciseSchema,
        },
      ],
    },
    {
      timestamps: true,
    }
  )

  mongoose.model('MetricsLesson', MetricsLessonSchema)

  module.exports = MetricsLessonSchema
})()
