(function () {
    'use strict';

    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;
    
    var KanbanSchema = new Schema({
        userStories: [{
            type: Schema.Types.ObjectId,
            ref: 'UserStory'
        }],
        sprint: {
            type: Schema.Types.ObjectId,
            ref: 'Sprint',
            required: [true, 'Uma kanban precisa estar numa sprint.']
        },

    }, { timestamps: true });



    mongoose.model('Kanban', KanbanSchema);

    module.exports = KanbanSchema;
})();