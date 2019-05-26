;(function() {
  'use strict'

  var mongoose = require('mongoose')
  var Schema = mongoose.Schema

  var AnonymousUserSchema = new Schema(
    {
      answeredLesson: {
        type: Schema.Types.ObjectId,
        ref: 'MetricsLesson',
      },
    },
    {
      timestamps: true,
    }
  )

  mongoose.model('AnonymousUser', AnonymousUserSchema)

  module.exports = AnonymousUserSchema
})()
