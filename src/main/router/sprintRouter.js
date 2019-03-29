(function () {
    'use strict';

    var express = require('express');
    var jwt = require('jsonwebtoken');
    var _ = require('../util/util');

    var SprintService = require('../service/sprintService');

    /**
     * Router used to access the sprint entity.
     * URL: /api/organization/:organizationId/team/:teamId/sprint
     */
    var sprintRouter = express.Router({ mergeParams: true });

    /**
     * POST /api/organization/:organizationId/team/:teamId/sprint
     * Create new sprints.
     *
     * @returns {Promise} Promise with the new sprints.
     */
    sprintRouter.post(['', '/'], function (req, res) {
        var userId = req.user._id.toString();

        return SprintService.createSprints(req.params.teamId, userId, req.body)
            .then(function (response) {
                return res.status(_.CREATED).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
     * PUT /api/organization/:organizationId/team/:teamId/sprint/:sprintId
     * Update an existing sprint.
     *
     * @returns {Promise} Promise with the updated sprint.
     */
    sprintRouter.put('/:sprintId', function (req, res) {
        var userId = req.user._id.toString();

        return SprintService.updateSprint(req.params.teamId, req.params.sprintId, userId, req.body)
            .then(function (response) {
                return res.status(_.OK).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
    * GET /api/organization/:organizationId/team/:teamId/sprint/:sprintId
    * Get the sprint that has the given ID.
    *
    * @returns {Promise} Promise with the sprint.
    */
    sprintRouter.get('/:sprintId', function (req, res) {
        return SprintService.getSprint(req.params.sprintId, true)
            .then(function (response) {
                return res.status(_.OK).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
     * GET /api/organization/:organizationId/team/:teamId/sprint/
     * Get the sprints that have the given team ID.
     *
     * @returns {Promise} Promise with the sprint.
     */
    sprintRouter.get('', function (req, res) {
        return SprintService.getSprints(req.params.teamId, true)
            .then(function (response) {
                return res.status(_.OK).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
    * Get the kanban for sprint that has the given ID.

    * GET /api/organization/:organizationId/team/:teamId/sprint/:sprintId/kanban
    *
    * @returns {Promise} Promise with the kanban.
    */
    sprintRouter.get('/:sprintId/kanban', function (req, res) {
        return SprintService.getKanbanBySprint(req.params.sprintId, req.true)
            .then(function (response) {
                return res.status(_.OK).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
     * POST /api/organization/:organizationId/team/:teamId/sprint/:sprintId/kanban
     * Add a US present in the backlog team to TODO list.
     */
    sprintRouter.post('/:sprintId/kanban', function (req, res) {
        return SprintService.addCardToTODOList(req.params.sprintId, req.body)
            .then(function (response) {
                return res.status(_.OK).json(response);
            })
            .catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });

    })

    /**
     * PUT /api/organization/:organizationId/team/:teamId/sprint/:sprintId/kanban
     * Update an existing kanban.
     *
     * @return {Promise} Promise with the updated kanban.
     */
    sprintRouter.put('/:sprintId/kanban', function (req, res) {
        return SprintService.updateKanban(req.params.sprintId, req.body)
            .then(function (response) {
                return res.status(_.OK).json(response);
            }).catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    })


    /**
     * PUT /api/organization/:organizationId/team/:teamId/sprint/:sprintId/kanban/:userStoryId
     * Move a US from Backlog to Sprint
     *
     * @return {Promise} Promise with the updated kanban.
     */
    sprintRouter.put('/:sprintId/kanban/:userStoryId', function (req, res) {
        return SprintService.moveUsFromBacklogToSprint(req.params.sprintId, req.params.userStoryId)
            .then(function (response) {
                return res.status(_.OK).json(response);
            }).catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    })

    module.exports = sprintRouter;
})();