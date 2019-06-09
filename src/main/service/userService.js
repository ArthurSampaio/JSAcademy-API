;(function() {
  'use strict'

  var mongoose = require('mongoose')
  var _ = require('../util/util')
  var User = mongoose.model('User')
  var AnonymousUser = mongoose.model('AnonymousUser')

  /**
   * Service that handles operations involving users.
   */
  var UserService = {}

  /**
   * Get all the users.
   *
   * @param {boolean} raw If true, this method will return the raw Mongoose
   *                      document instead of a JavaScript object.
   * @returns {Promise} Promise with the user.
   */
  UserService.getUsers = function(raw) {
    var rawUsers = User.find({}).exec()

    return rawUsers.then(function(users) {
      if (!users) {
        throw Error('Nenhum usuário encontrado.')
      }
      return raw
        ? rawUsers
        : _.map(users, function(user) {
            return user.toObject()
          })
    })
  }

  /**
   * Get the user with the given ID.
   *
   * @param {int} userId ID of the user.
   * @param {boolean} raw If true, this method will return the raw Mongoose
   *                      document instead of a JavaScript object.
   * @returns {Promise} Promise with the user.
   */
  UserService.getUser = function(userId, raw) {
    var params = {
      _id: userId,
    }
    var rawUser = User.findOne(params)
      .populate({
        path: 'answeredLesson',
        populate: { path: 'lesson', populate: { path: 'exercises' } },
      })
      .exec()

    return rawUser.then(function(user) {
      if (!user) {
        throw Error('Nenhum usuário com id ' + userId + ' encontrado.')
      }
      return raw ? rawUser : user.toObject()
    })
  }

  /**
   * Get the user with the given e-mail.
   *
   * @param {String} email E-mail of the user.
   * @param {boolean} raw If true, this method will return the raw Mongoose
   *                      document instead of a JavaScript object.
   * @returns {Promise} Promise with the user.
   */
  UserService.getUserByEmail = function(email, raw) {
    var rawUser = User.findOne({ email }).exec()

    return rawUser.then(function(user) {
      if (!user) {
        throw Error('Nenhum usuário com e-mail ' + email + ' encontrado.')
      }
      return raw ? rawUser : user.toObject()
    })
  }

  /**
   * Create a new user.
   *
   * @param {Object} user User to be saved.
   * @returns {Promise} Promise with the new user.
   */
  UserService.createUser = function(user) {
    return new User(user).save().then(function(persistedUser) {
      return persistedUser.toObject()
    })
  }

  /**
   * Create a new Anonymous User
   * @returns {Promise} Promise with the new Anonymous User
   */
  UserService.createAnonymousUser = function() {
    return new AnonymousUser().save().then(function(persistedUser) {
      return persistedUser.toObject()
    })
  }

  UserService.getAnonymousUser = async function(userId, raw) {
    var params = {
      _id: userId,
    }
    var rawUser = AnonymousUser.findOne(params).exec()

    return rawUser.then(function(user) {
      if (!user) {
        throw Error('Nenhum usuário anônimo com id ' + userId + ' encontrado.')
      }
      return raw ? rawUser : user.toObject()
    })
  }

  UserService.updateAnonymousUser = async function(userId, user) {
    return UserService.getAnonymousUser(userId, true).then(function(userDb) {
      _.copyModel(userDb, user)

      return userDb.save().then(function(persistedUser) {
        return persistedUser.toObject()
      })
    })
  }

  /**
   * Update an existing user.
   *
   * @param {int} userId ID of the user.
   * @param {Object} user Updated user.
   * @returns {Promise} Promise with the updated user.
   */
  UserService.updateUser = function(userId, user) {
    return UserService.getUser(userId, true).then(function(userDb) {
      _.copyModel(userDb, user)

      return userDb.save().then(function(persistedUser) {
        return persistedUser.toObject()
      })
    })
  }

  /**
   * Delete the user with the given ID.
   *
   * @param {int} userId ID of the user.
   * @returns {Promise} Promise with the result of the operation.
   */
  UserService.deleteUser = function(userId) {
    var params = {
      _id: userId,
    }

    return User.findOneAndRemove(params)
      .exec()
      .then(function(user) {
        if (!user) {
          throw Error('Nenhum usuário com id ' + userId + ' encontrado.')
        }
      })
  }

  /**
   * Searches for a user with the given parameters.
   *
   * @param {Object} params Search parameters.
   * @param {boolean} raw If true, this method will return the raw Mongoose
   *                      document instead of a JavaScript object.
   * @returns {Promise} Promise with the user.
   */
  UserService.searchForUser = function(params, raw) {
    var rawUser = User.findOne(params).exec()

    return rawUser.then(function(user) {
      if (!user) {
        throw Error(
          'Nenhum usuário que se encaixe nos parâmetros fornecidos foi encontrado.'
        )
      }
      return raw ? rawUser : user.toObject()
    })
  }

  module.exports = UserService
})()
