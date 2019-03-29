(function () {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var TeamSchema = new Schema({
        name: {
            type: String,
            required: [true, 'Um time precisa de um nome.']
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        organization: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: [true, 'Um time precisa estar numa organização.']
        },
        manager: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Um time precisa de um gerente.']
        },
        backlog: {
            type: Schema.Types.ObjectId,
            ref: 'Backlog',
            required: [true, 'Um time precisa ter um backlog.']
        },
        sprints: [{
            type: Schema.Types.ObjectId,
            ref: 'Sprint'
        }]
    },
        {
            timestamps: true
        }
    );

    mongoose.model('Team', TeamSchema);

    module.exports = TeamSchema;
})();
