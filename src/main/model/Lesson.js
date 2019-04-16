(function () {
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var LessonSchema = new Schema({
    name: {
      type: String,
      required: [true, 'A Module need has a name.']
    },
    orderLesson: {
      type: Number,
      default: 0,
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: 'Module'
    },
    exercises: [{
      type: Schema.Types.ObjectId,
      ref: 'Exercise'
    }]
  },
    {
      timestamps: true
    }
  );

  mongoose.model('Lesson', LessonSchema);

  module.exports = LessonSchema;
})();
