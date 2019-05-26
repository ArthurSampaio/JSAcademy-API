;(function() {
  'use strict'

  var mongoose = require('mongoose')
  var Schema = mongoose.Schema

  var ExerciseSchema = new Schema(
    {
      title: {
        type: String,
        required: [true, 'A Exercise need has a title.'],
      },
      description: {
        type: String,
        required: [true, 'A Module need has a description.'],
      },
      appraisedFunction: {
        type: String,
        default: `function xpto(...args){  }`,
      },
      testCases: [
        {
          input: {
            type: String,
          },
          output: {
            type: String,
          },
          default: [],
        },
      ],
    },
    {
      timestamps: true,
    }
  )

  mongoose.model('Exercise', ExerciseSchema)

  module.exports = ExerciseSchema
})()
