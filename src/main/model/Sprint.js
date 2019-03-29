(function () {
    'use strict';

    var mongoose = require('mongoose');
    var UserStorySchema = require('./UserStory');

    var Schema = mongoose.Schema;

    var SprintSchema = new Schema({
        name: {
            type: String,
            required: [true, 'Uma sprint precisa de um nome.']
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            required: [true, 'Uma sprint precisa ser de um time.']
        },
        startDate: {
            type: Date,
            default: Date.now,
            required: [true, 'Uma sprint precisa ter uma data de início.']
        },
        endDate: {
            type: Date,
            required: [true, 'Uma sprint precisa ter uma data de fim.']
        },
        kanban: {
            type: Schema.Types.ObjectId,
            ref: 'Kanban'
        }
    }, { timestamps: true });

    mongoose.model('Sprint', SprintSchema);

    module.exports = SprintSchema;
})();
