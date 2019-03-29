(function () {
    'use strict';

    var mongoose = require('mongoose');
    var _ = require('../util/util');
    var Organization = mongoose.model('Organization');

    /**
     * Service that handles operations involving Organizations.
     */
    var OrganizationService = {};

    /**
     * Get the Organization with the given ID.
     *
     * @param {int} id ID of the Organization.
     * @param {boolean} raw If true, this method will return the raw Mongoose
     *                      document instead of a JavaScript object.
     * @return {Promise} Promise with the Organization.
     */
    OrganizationService.getOrganization = function (id, raw) {
        var params = {
            _id: id
        };
        var rawOrganization = Organization
            .findOne(params)
            .populate('members')
            .populate('teams')
            .exec();

        return rawOrganization.then(function (organization) {
            if (!organization) {
                throw Error('Nenhuma organização com id ' + id + ' foi encontrada.');
            }
            return raw ? rawOrganization : organization.toObject();
        });
    };

    /**
     * Get the Organizations of the User with userID.
     *
     * @param {int} userId ID of the User.
     * @param {boolean} raw If true, this method will return the raw Mongoose
     *                      document instead of a JavaScript object.
     * @return {Promise} Promise with the Organization.
     */
    OrganizationService.getOrganizationsFromUser = function (userId, raw) {
        var params = {
            $or: [
                { owner: userId },
                { members: userId }
            ]
        };
        var rawOrganizations = Organization.find(params).exec();

        return rawOrganizations.then(function (organizations) {
            if (!organizations) {
                throw Error('Nenhuma organização que contenha o usuário de id ' + userId + ' como membro ou dono foi encontrada.');
            }
            return raw ?
                rawOrganizations :
                _.map(organizations, function (organization) { return organization.toObject(); });
        });
    };

    /**
     * Create a new Organization.
     *
     * @param {Object} organization Organization to be saved.
     * @return {Promise} Promise with the new Organization.
     */
    OrganizationService.createOrganization = function (organization) {
        return new Organization(organization).save()
            .then(function (persistedOrganization) {
                return persistedOrganization.toObject();
            });
    };

    /**
     * Update an existing Organization.
     *
     * @param {int} id ID of the Organization to update.
     * @param {Object} organization Updated organization.
     * @return {Promise} Promise with the updated team.
     */
    OrganizationService.updateOrganization = function (id, userId, organization) {
        return OrganizationService.getOrganization(id, true)
            .then(function (organizationDB) {
                if (userId !== organizationDB.owner.toString()) {
                    throw Error('O usuário com id ' + userId + ' não é o dono da organização de id ' + id + '.');
                }
                _.copyModel(organizationDB, organization);

                return organizationDB.save()
                    .then(function (persistedOrganization) {
                        return persistedOrganization.toObject();
                    });
            });
    };

    /**
     * Delete an existing Organization.
     *
     * @param {int} id ID of the Organization to delete.
     */
    OrganizationService.deleteOrganization = function (id) {
        var params = {
            _id: id
        };

        return Organization.findOneAndRemove(params).exec()
            .then(function (organization) {
                if (!organization) {
                    throw Error('Nenhuma organização com id ' + id + ' foi encontrada.');
                }
            }
            );
    }

    module.exports = OrganizationService;
})();
