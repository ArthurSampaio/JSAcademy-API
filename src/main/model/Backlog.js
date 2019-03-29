(function () {
    'use strict';

    var mongoose = require('mongoose');
    var UserStorySchema = require('./UserStory');

    var UserStory = mongoose.model('UserStory');


    var Schema = mongoose.Schema;

    var BacklogSchema = new Schema({
        userStories: [{
            type: UserStorySchema
        }]
    }, { timestamps: true });


    BacklogSchema.pre('save', function (next){
        var backlog = this;
        var promises = [];
        for(var i = 0; i < backlog.userStories.length; i++){
            var us = backlog.userStories[i];
            var promise = UserStory.findOneAndUpdate({_id:us._id}, us, {upsert: true}).exec();
            promises.push(promise);
        }
        return Promise.all(promises).then(function(element) {
            next();
        })
    });


    mongoose.model('Backlog', BacklogSchema);

    module.exports = BacklogSchema;
})();
