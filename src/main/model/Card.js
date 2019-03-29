(function () {
    'use strict';

    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;
    var ChecklistSchema = require('./Checklist');
    var CommentSchema = require('./Comment');


    var CardSchema = new Schema({
        title: {
            type: String
        }, 
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        checkLists: [{
            type: ChecklistSchema
        }],
        comments: [{
            type: CommentSchema
        }],
        labels: [{
            type: String
        }]      
        
    }, { timestamps: true });

    mongoose.model('Card', CardSchema);

    module.exports = CardSchema;
})();
