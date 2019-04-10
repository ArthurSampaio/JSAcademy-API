(function () {
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var ModuleSchema = new Schema({
    name: {
      type: String,
      required: [true, 'A Module need has a name.']
    },
    description: {
      type: String,
      required: [true, 'A Module need has a description.']
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A Module need has an owner.']
    },
    tasks: [{
      type: Schema.Types.ObjectId,
      ref: 'Lesson'
    }]
  },
    {
      timestamps: true
    }
  );

  mongoose.model('Module', ModuleSchema);

  module.exports = ModuleSchema;
})();
