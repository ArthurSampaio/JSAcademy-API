;(function() {
  'use strict'

  var express = require('express')
  var _ = require('../util/util')

  var UserService = require('../service/userService')
  var TeamService = require('../service/teamService')

  /**
   * Router used to access the user entity.
   * URL: /api/user
   */
  var userRouter = express.Router()

  /**
   * GET /api/user.
   * Get all the users.
   *
   * @returns {Promise} Promise with the user.
   */
  userRouter.get(['', '/'], function(req, res) {
    return UserService.getUsers()
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  /**
   * GET /api/user/search.
   * Get a user passing search parameters.
   *
   * @returns {Promise} Promise with the user.
   */
  userRouter.get('/search', function(req, res) {
    return UserService.searchForUser(req.query)
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  /**
   * GET /api/user/:userId.
   * Get the user that has the given ID.
   *
   * @returns {Promise} Promise with the user.
   */
  userRouter.get('/:userId', function(req, res) {
    return UserService.getUser(req.params.userId)
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  /**
   * GET /api/user/:userId/team.
   * Get the teams to which a user belongs.
   *
   * @returns {Promise} Promise with the list of teams.
   */
  userRouter.get('/:userId/team', function(req, res) {
    return TeamService.getTeamsFromUser(req.params.userId)
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.NOT_FOUND)
          .json(error.message || error)
      })
  })

  /**
   * POST /api/user.
   * Create a new user.
   *
   * @returns {Promise} Promise with the new user.
   */
  userRouter.post(['', '/'], function(req, res) {
    return UserService.createUser(req.body)
      .then(function(response) {
        return res.status(_.CREATED).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  /**
   * PUT /api/user/:userId
   * Update an existing user.
   *
   * @returns {Promise} Promise with the updated user.
   */
  userRouter.put('/:userId', function(req, res) {
    return UserService.updateUser(req.params.userId, req.body)
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  /**
   * DELETE /api/user/:userId
   * Delete the user that has the given ID.
   *
   * @returns {Promise} Promise with the result of the operation.
   */
  userRouter.delete('/:userId', function(req, res) {
    return UserService.deleteUser(req.params.userId)
      .then(function(response) {
        return res.status(_.OK).json(response)
      })
      .catch(function(error) {
        return res
          .status(error.status || _.BAD_REQUEST)
          .json(error.message || error)
      })
  })

  module.exports = userRouter
})()
