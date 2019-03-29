(function () {
    'use strict';

    var express = require('express');
    var jwt = require('jsonwebtoken');
    var _ = require('../util/util');

    var BacklogService = require('../service/backlogService');

    /**
     * Router used to access the backlog entity.
     * URL: /api/organization/:organizationId/team/:teamId/backlog
     */
    var backlogRouter = express.Router({ mergeParams: true });

    /**
     * PUT /api/organization/:organizationId/team/:teamId/backlog
     * Update an existing backlog.
     *
     * @returns {Promise} Promise with the updated backlog.
     */
    backlogRouter.put(['', '/'], function (req, res) {
        return BacklogService.updateBacklog(req.params.organizationId, req.params.teamId, req.body)
            .then(function (response) {
                return res.status(_.OK).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
     * PUT /api/organization/:organizationId/team/:teamId/backlog/userStory/:userStoryId
     * Update an existing user story.
     *
     * @returns {Promise} Promise with the updated user story.
     */
    backlogRouter.put(['/userStory/:userStoryId'], function (req, res) {
        return BacklogService.updateUserStory(req.params.userStoryId, req.body)
            .then(function (response) {
                return res.status(_.OK).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    module.exports = backlogRouter;
})();