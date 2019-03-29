(function () {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var ListSchema = require('./List');
    var List = mongoose.model('List');

    var UserStorySchema = new Schema({
        title: {
            type: String,
            required: [true, 'Uma US precisa de um título.']
        },
        description: {
            type: String
        },
        status: {
            type: String
        },
        priority: {
            type: String
        },
        acceptance: {
            type: String
        },
        tags: [{
            type: String
        }],
        points: {
            type: Number
        },
        pointsDone: [{
            value: {
                type: Number,
            },
            date: {
                type: Date,
                default: Date.now,
            },      
            author: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            default: []
        }],
        lists:  [{
            type: ListSchema,
            default: []
        }]
    }, { timestamps: true });

     /**
     * Pre-save that add default lists in UserStory
     **/
    UserStorySchema.pre('save', function (next) {
        var userStory = this;
        var defaultLists = ["TODO", "DOING", "DONE"];
        if (this.lists.length === 0) {
            defaultLists = defaultLists.map(function(item) {
                return  {name: item,cards: []};
            });
            userStory.lists = defaultLists;
        };
	next();
    });


    mongoose.model('UserStory', UserStorySchema);

    module.exports = UserStorySchema;
})();
