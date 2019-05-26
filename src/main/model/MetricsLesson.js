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
