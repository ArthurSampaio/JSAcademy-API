(function () {
    'use strict';

    var mongoose = require('mongoose');
    var _ = require('../util/util');

    var TeamService = require('./teamService');
    var Backlog = mongoose.model('Backlog');
    var UserStory = mongoose.model('UserStory');

    /**
     * Service that handles operations involving backlogs.
     */
    var BacklogService = {};

    /**
     * Retrieves a US from the BD.
     *
     * @param {Number} userStoryId The US's id.
     * @param {boolean} raw If true, this method will return the raw Mongoose
     *                      document instead of a JavaScript object.
     * @returns {Promise} Promise with the US.
     */
    BacklogService.getUserStory = function(userStoryId, raw) {
        var params = {
            _id: userStoryId
        };

        var rawUserStory= UserStory.findOne(params).exec();

        return rawUserStory.then(function (userStory) {
            if (!userStory) {
                throw Error('Nenhuma US com id' + userStoryId + ' foi encontrada.');
            }
            return raw ? rawUserStory : userStory.toObject();
        });
    };

    /**
     * Update an existing backlog.
     *
     * @param {int} organizationId ID of the organization.
     * @param {int} teamId ID of the team.
     * @param {Object} backlog Updated backlog.
     * @returns {Promise} Promise with the updated backlog.
     */
    BacklogService.updateBacklog = function (organizationId, teamId, backlog) {
        return TeamService.getTeamInOrganization(organizationId, teamId, true)
            .then(function (team) {
                var backlogDb = team.backlog;
                _.copyModel(backlogDb, backlog);

                return backlogDb.save()
                    .then(function (persistedBacklog) {
                        return persistedBacklog.toObject();
                    });
            });
    };

    /**
     * Updates an existing US.
     *
     * @param {Number} userStoryId The id of the US to be updated.
     * @param {Object} userStory Updated US.
     * @returns {Promise} Promise with the updated US.
     */
    BacklogService.updateUserStory = function (userStoryId, userStory) {
        return BacklogService.getUserStory(userStoryId, true)
            .then(function (userStoryBD) {
                _.copyModel(userStoryBD, userStory);

                return userStoryBD.save()
                    .then(function (persistedUserStory) {
                        return persistedUserStory.toObject();
                    });
            });
    };

    module.exports = BacklogService;
})();