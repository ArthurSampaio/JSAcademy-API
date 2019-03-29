(function () {
    'use strict';
    
    var express = require('express');
    var jwt = require('jsonwebtoken');
    var _ = require('../util/util');

    var TeamService = require('../service/teamService');

    /**
     * Router used to access the team entity.
     * URL: /api/organization/:organizationId/team
     */
    var teamRouter = express.Router({ mergeParams: true });

    /**
     * GET /api/organization/:organizationId/team/:teamId.
     * Get the team that has the given ID.
     *
     * @returns {Promise} Promise with the team.
     */
    teamRouter.get('/:teamId', function (req, res) {
        return TeamService.getTeamInOrganization(req.params.organizationId, req.params.teamId)
            .then(function (response) {
                return res.status(_.OK).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
     * GET /api/organization/:organizationId/team.
     * Get the teams from the organization with the given ID.
     *
     * @returns {Promise} Promise with the list of teams.
     */
    teamRouter.get(['', '/'], function (req, res) {
        return TeamService.getTeamsFromOrganization(req.params.organizationId)
            .then(function (response) {
                return res.status(_.OK).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
     * POST /api/organization/:organizationId/team.
     * Create a new team.
     *
     * @returns {Promise} Promise with the new user.
     */
    teamRouter.post(['', '/'], function (req, res) {
        var userId = req.user._id.toString();
        var team = req.body;
        team.organization = req.params.organizationId;

        return TeamService.createTeam(userId, team)
            .then(function (response) {
                return res.status(_.CREATED).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
     * PUT /api/organization/:organizationId/team/:teamId
     * Update an existing team.
     *
     * @returns {Promise} Promise with the updated team.
     */
    teamRouter.put('/:teamId', function (req, res) {
        var userId = req.user._id.toString();

        return TeamService.updateTeam(req.params.organizationId, req.params.teamId, userId, req.body)
            .then(function (response) {
                return res.status(_.OK).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
     * DELETE /api/organization/:organizationId/team/:teamId
     * Delete the team that has the given ID.
     *
     * @returns {Promise} Promise with the result of the operation.
     */
    teamRouter.delete('/:teamId', function (req, res) {
        var userId = req.user._id.toString();
        
        return TeamService.deleteTeam(req.params.organizationId, req.params.teamId, userId)
            .then(function (response) {
                return res.status(_.OK).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    module.exports = teamRouter;
})();