(function () {
    'use strict';

    var mongoose = require('mongoose');
    var _ = require('../util/util');

    var OrganizationService = require('./organizationService');
    var Backlog = mongoose.model('Backlog');
    var Team = mongoose.model('Team');

    /**
     * Service that handles operations involving teams.
     */
    var TeamService = {};

    /**
     * Get the team with the given ID.
     *
     * @param {int} id ID of the team.
     * @param {boolean} raw If true, this method will return the raw Mongoose
     *                      document instead of a JavaScript object.
     * @return {Promise} Promise with the team.
     */
    TeamService.getTeam = function (id, raw) {
        var params = {
            _id: id
        };
        var rawTeam = Team.findOne(params).exec();

        return rawTeam.then(function (team) {
            if (!team) {
                throw Error('Nenhum time com id ' + id + ' foi encontrado.');
            }
            return raw ? rawTeam : team.toObject();
        });
    };

    /**
     * Get the team with ID teamId from the organization with ID organizationId.
     * 
     * @param {int} organizationId ID of the organization.
     * @param {int} teamId ID of the team.
     * @param {boolean} raw If true, this method will return the raw Mongoose
     *                      document instead of a JavaScript object.
     * @returns {Promise} Promise with the team.
     */
    TeamService.getTeamInOrganization = function (organizationId, teamId, raw) {
        var params = {
            _id: teamId,
            organization: organizationId
        };
        var rawTeam = Team
            .findOne(params)
            .populate('members')
            .populate('backlog')
            .populate('sprints')
            .exec();

        return rawTeam.then(function (team) {
            if (!team) {
                throw Error('Nenhum time com id ' + teamId + ' na organização de id ' + organizationId + ' foi encontrado.');
            }
            return raw ? rawTeam : team.toObject();
        });
    };

    /**
     * Get the list of teams within an organization.
     *
     * @param {int} organizationId ID of the organization.
     * @param {boolean} raw If true, this method will return the raw Mongoose
     *                      document instead of a JavaScript object.
     * @returns {Promise} Promise with the list of teams.
     */
    TeamService.getTeamsFromOrganization = function (organizationId, raw) {
        var params = {
            organization: organizationId
        };
        var rawTeams = Team.find(params).exec();

        return rawTeams.then(function (teams) {
            if (!teams) {
                throw Error('Nenhum time encontrado na organização de id ' + organizationId + '.');
            }
            return raw ? rawTeams : teams; // FIXME: should be teams.toObject();
        });
    };

    /**
     * Get the list of teams to which a user belongs.
     *
     * @param {int} userId ID of the user.
     * @param {boolean} raw If true, this method will return the raw Mongoose
     *                      document instead of a JavaScript object.
     * @returns {Promise} Promise with the list of teams.
     */
    TeamService.getTeamsFromUser = function (userId, raw) {
        var params = {
            members: userId
        };

        var rawTeams = Team.find(params).exec();

        return rawTeams.then(function (teams) {
            if (!teams) {
                throw Error('O usuário de id ' + userId + ' não é membro de nenhum time.');
            }
            return raw ?
                rawTeams :
                _.map(teams, function (team) { return team.toObject() });
        });
    };

    /**
     * Create a new team.
     *
     * @param {Object} team Team to be saved.
     * @returns {Promise} Promise with the new team.
     */
    TeamService.createTeam = function (userId, team) {
        return new Backlog().save()
            .then(function (persistedBacklog) {
                team.backlog = persistedBacklog._id;
                return new Team(team).save()
                    .then(function (persistedTeam) {
                        return persistedTeam.toObject();
                    })
                    .then(function (teamObj) {
                        return TeamService._addTeamAndMembersToOrg(userId, teamObj);
                    });
            });
    };

    /**
     * Update organization after creating a team.
     * 
     * @param {Object} team Team that was added to the organization.
     * @returns {Promise} Promise with the new team.
     * @private
     */
    TeamService._addTeamAndMembersToOrg = function (userId, team) {
        return OrganizationService.getOrganization(team.organization)
            .then(function (organization) {
                organization.teams.push(team._id);

                var newMembers = _.difference(_.map(team.members, function (e) { return e.toString(); }),
                    _.map(organization.members, function (e) { return e._id.toString(); }));
                organization.members = _.concat(organization.members, newMembers);
                return OrganizationService.updateOrganization(team.organization, userId, organization)
                    .then(function () {
                        return team;
                    });
            });
    };

    /**
     * Update an existing team.
     *
     * @param {int} organizationId ID of the organization.
     * @param {int} teamId ID of the team.
     * @param {int} userId ID of the user that is updating the team.
     * @param {Object} team Updated team.
     * @returns {Promise} Promise with the updated team.
     */
    TeamService.updateTeam = function (organizationId, teamId, userId, team) {
        return TeamService.getTeamInOrganization(organizationId, teamId, true)
            .then(function (teamDb) {
                if (userId !== teamDb.manager.toString()) {
                    throw Error('O usuário com id ' + userId + ' não é o gerente do time de id ' + teamId + '.');
                }
                _.copyModel(teamDb, team);

                return teamDb.save()
                    .then(function (persistedTeam) {
                        return persistedTeam.toObject();
                    });
            });
    };

    /**
     * Delete the team with ID teamId from the organization with ID organizationId.
     *
     * @param {int} organizationId ID of the organization.
     * @param {int} teamId ID of the team.
     * @param {int} managerId ID of the team's manager
     * @returns {Promise} Promise with the result of the operation.
     */
    TeamService.deleteTeam = function (organizationId, teamId, managerId) {
        var params = {
            _id: teamId,
            organization: organizationId,
            manager: managerId
        };

        return Team.findOneAndRemove(params).exec().then(function (team) {
            if (!team) {
                throw Error('Nenhum time com id ' + teamId + ' encontrado na organização de id ' + organizationId + '.');
            }
        });
    };

    module.exports = TeamService;
})();
