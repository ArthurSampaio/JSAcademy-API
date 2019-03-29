(function() {
    'use strict';

    var express = require('express');
    var _ = require('../util/util');

    var OrganizationService = require('../service/organizationService');

    /**
     * Router used to access the Organization entity.
     * URL: /api/organization/:organizationId
     */
    var organizationRouter = express.Router();

    /**
     * GET /api/organization/:organizationId
     * Get the Organization that has the given ID.
     *
     * @return {Promise} Promise with the Organization.
     */
    organizationRouter.get('/:organizationId', function (req, res) {
        return OrganizationService.getOrganization(req.params.organizationId)
            .then(function (response) {
                return res.status(_.OK).json(response);
            }).catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
     * GET /api/organization
     * Get the Organizations from the logged user.
     *
     * @return {Promise} Promise with the Organization.
     */
    organizationRouter.get(['', '/'], function (req, res) {
        return OrganizationService.getOrganizationsFromUser(req.user._id.toString())
            .then(function (response) {
                return res.status(_.OK).json(response);
            }).catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
     * POST /api/organization
     * Create a new Organization.
     *
     * @return {Promise} Promise with the new Organization.
     */
    organizationRouter.post(['', '/'], function (req, res) {
        return OrganizationService.createOrganization(req.body)
            .then(function (response) {
                return res.status(_.CREATED).json(response);
            }).catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
     * PUT /api/organization/:organizationId
     * Update an existing Organization.
     *
     * @return {Promise} Promise with the updated Organization.
     */
    organizationRouter.put('/:organizationId', function (req, res) {
        var userId = req.user._id.toString();

        return OrganizationService.updateOrganization(req.params.organizationId, userId, req.body)
            .then(function (response) {
                return res.status(_.OK).json(response);
            }).catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    /**
     * DELETE /api/organization/:organizationId
     * Delete an existing Organization.
     *
     * @return {Promise} Promise with the updated Organization.
     */
    organizationRouter.delete('/:organizationId', function (req, res) {
        return OrganizationService.deleteOrganization(req.params.organizationId)
            .then(function (response) {
                return res.status(_.OK).json(response);
            }).catch(function (error) {
                return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
            });
    });

    module.exports = organizationRouter;
})();
