(function () {
    'use strict';

    var mongoose = require('mongoose');
    var _ = require('../util/util');

    var TeamService = require('./teamService');
    var KanbanService = require('./kanbanService');
    var CardService = require('./cardService');


    var Sprint = mongoose.model('Sprint');

    /**
     * Service that handles operations involving sprints.
     */
    var SprintService = {};

    /**
     * Get the sprint with the given ID.
     *
     * @param {int} id ID of the sprint.
     * @param {boolean} raw If true, this method will return the raw Mongoose
     *                      document instead of a JavaScript object.
     * @return {Promise} Promise with the sprint.
     */
    SprintService.getSprint = function (id, raw) {
        var params = {
            _id: id
        };
        var rawSprint = Sprint.findOne(params).populate('kanban').exec();
        return rawSprint.then(function (sprint) {
            if (!sprint) {
                throw Error('Nenhuma sprint  com id ' + id + ' foi encontrada.');
            }
            return raw ? rawSprint : sprint.toObject();
        });
    };

    /**
     * Get the sprints with the given team ID.
     *
     * @param {int} id ID of the team.
     * @param {boolean} raw If true, this method will return the raw Mongoose
     *                      document instead of a JavaScript object.
     * @return {Promise} Promise with the sprint.
     */
    SprintService.getSprints = function (teamId, raw) {
        var params = {
            team: teamId
        };
        var rawSprint = Sprint.find(params).populate('kanban').exec();
        return rawSprint.then(function (sprint) {
            if (!sprint) {
                throw Error('Nenhuma sprint  com id ' + id + ' foi encontrada.');
            }
            return raw ? rawSprint : sprint.toObject();
        });
    };

    /**
     * Get the kanban for specific sprint
     * @param {Number} sprintId ID for the sprint 
     */
    SprintService.getKanbanBySprint = function (sprintId){
        return SprintService.getSprint(sprintId, true).then( function(sprint){
            return KanbanService.getKanban(sprint.kanban);
        })
    }

    /**
     * Create and save a card in TODO list; 
     * @param {Number} sprintId ID for the sprint
     * @param {Object} card card to be save;
     */
    SprintService.addCardToTODOList = function (sprintId, card){
        return SprintService.getKanbanBySprint(sprintId).then(function (kanban){
            return kanban;
        }).then(function(kanban){
            return CardService.createCard(card).then(function (cardSaved){
                return KanbanService.addCardToKanban(kanban, cardSaved);
            })
        });
    }

    /**
     * Add a US from backlog to sprint

     * @param {*} sprintId id for the sprint
     * @param {*} userStoryId for the userStory
     */
    SprintService.moveUsFromBacklogToSprint = function (sprintId, userStoryId){
        return KanbanService.addUserStory(sprintId, userStoryId);
    }

    /**
     * Update an existing kanban.
     *
     * @param {int} sprintId ID of the sprint that has the kanban to be updated.
     * @param {Object} kanban Updated kanban.
     * @return {Promise} Promise with the updated kanban.
     */
    SprintService.updateKanban = function (sprintId, kanban) {
        return KanbanService.getKanbanBySprintId(sprintId, true)
            .then(function (kanbanDb) {
                _.copyModel(kanbanDb, kanban);

                return kanbanDb.save()
                    .then(function (persistedKanban) {
                        return persistedKanban.toObject();
                    });
            });
    }

    /**
     * Create new sprints.
     *
     * @param {int} teamId ID of the team.
     * @param {int} userId ID of the user.
     * @param {Array} sprints Array of sprints to be saved.
     * @returns {Promise} Promise with the new sprints.
     */
    SprintService.createSprints = function (teamId, userId, sprints) {
        return TeamService.getTeam(teamId)
            .then(function (team) {
                if (!_.contains(_.map(team.members, function (e) { return e.toString(); }), userId) &&
                    team.manager.toString() != userId) {
                    throw Error('O usuário não é parte do time.');
                }

                var promises = [];
                for (var i = 0; i < sprints.length; i++) {
                    var sprint = sprints[i];
                    promises.push(SprintService._createSprint(sprint, team, teamId, userId, i));
                }
                return Promise.all(promises).then(function(createdSprints) {
                    SprintService._addSprintsToTeam(createdSprints, teamId, userId);
                });
            });
    };

    /**
     * Create only one sprint.
     * @param {Object} sprint Sprint to be created.
     * @param {Object} team Team that will have the new sprint.
     * @param {int} teamId ID of the team.
     * @param {int} userId ID of the user.
     * @param {int} index Index of sprint.
     * @returns {Promise} Promise with the new sprint.
     */
    SprintService._createSprint = function (sprint, team, teamId, userId, index) {
        sprint.team = teamId;
        sprint.name = "Sprint " + SprintService._calculateSprintNumber(team, index);
        return new Sprint(sprint).save()
            .then(function (persistedSprint) {
                return persistedSprint.toObject();
            })
            .then(function (sprint) {
                return SprintService._addDefaultKanbanInSprint(sprint);
            });
    };

    /**
     * Update an existing sprint.
     *
     * @param {int} teamId ID of the team.
     * @param {int} sprintId ID of the sprint.
     * @param {int} userId ID of the user.
     * @param {Object} sprint Updated sprint.
     * @returns {Promise} Promise with the updated sprint.
     */
    SprintService.updateSprint = function (teamId, sprintId, userId, sprint) {
        return TeamService.getTeam(teamId)
            .then(function (team) {
                if (!_.contains(_.map(team.members, function (e) { return e.toString(); }), userId) &&
                    team.manager.toString() != userId) {
                    throw Error('O usuário não é parte do time.');
                }

                return SprintService._updateSprint(sprintId, sprint);
            });
    };

    /**
     * Update an existing sprint. This is a helper function.
     * 
     * @param {*} sprintId  ID of the sprint
     * @param {*} sprint Updated sprint
     * @returns {Promise} Promise with the updated sprint.
     */
    SprintService._updateSprint = function (sprintId, sprint){
        return SprintService.getSprint(sprintId, true)
                    .then(function (sprintDb) {
                        _.copyModel(sprintDb, sprint);
                        return sprintDb.save()
                            .then(function (persistedSprint) {
                                return persistedSprint.toObject();
                            });
                    });        
    }

    /**
     * Calculate the numbering for the sprint name by adding 1 + index position of
     * the sprint to the number of existing sprints on that team.
     * 
     * @param {Object} team Team that has the sprint.
     * @param {int} index Index of sprint.
     * @returns {int} Number of the new sprint.
     * @private
     */
    SprintService._calculateSprintNumber = function (team, index) {
        return team.sprints.length + 1 + index;
    };

    /**
     * Update team after creating sprints.
     * 
     * @param {Array} sprints Array with sprint that were added to the team.
     * @param {int} userId ID of the user.
     * @returns {Promise} Promise with the new sprint.
     * @private
     */
    SprintService._addSprintsToTeam = function (sprints, teamId, userId) {
        return TeamService.getTeam(teamId, false)
            .then(function (team) {
                _.each(sprints, function(sprint) {
                    team.sprints.push(sprint._id);
                });
                
                return TeamService.updateTeam(team.organization, team._id, userId, team)
                    .then(function () {
                        return sprints;
                    });
            });
    }

    /**
     * When a sprint is created, is added a default kanban with the TODO, DOING and DONE lists.
     * @param {Object} sprint Sprint to be updated. 
     */
    SprintService._addDefaultKanbanInSprint = function (sprint) {
        return KanbanService.createKanban(sprint._id)
            .then(function (kanban){
                sprint.kanban = kanban._id;
                return SprintService._updateSprint(sprint._id, sprint);
            })
    }

    module.exports = SprintService;
})();