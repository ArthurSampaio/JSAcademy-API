;(function() {
  'use strict'

  var mongoose = require('mongoose')
  var Schema = mongoose.Schema

  var LessonSchema = new Schema(
    {
      name: {
        type: String,
        required: [true, 'A Module need has a name.'],
      },
      orderLesson: {
        type: Number,
        default: 0,
      },
      exercises: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Exercise',
        },
      ],
      viewed: {
        type: Number,
        default: 0,
      },
      answered: {
        type: Number,
        default: 0,
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },
    {
      timestamps: true,
    }
  )

  mongoose.model('Lesson', LessonSchema)

  module.exports = LessonSchema
})()
