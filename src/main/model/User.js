;(function() {
  'use strict'

  var mongoose = require('mongoose')
  var Schema = mongoose.Schema
  var bcrypt = require('bcrypt')

  var SALT_FACTOR = 10

  /**
   * Validate an email address. See http://emailregex.com/ for more details
   * on the regex.
   * @param {String} email Email to be tested.
   * @return {Boolean} True if it's valid, false otherwise.
   */
  var validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }

  var UserSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Um usuário precisa de um nome.'],
      },
      email: {
        type: String,
        required: [true, 'Um usuário precisa de um e-mail.'],
        unique: true,
        validate: [validateEmail, 'O e-mail fornecido é inválido.'],
      },
      password: {
        type: String,
        required: [true, 'Um usuário precisa de um password.'],
      },
      answeredLesson: [
        {
          type: Schema.Types.ObjectId,
          ref: 'MetricsLesson',
        },
      ],
    },
    {
      toObject: {
        transform: function(doc, ret) {
          delete ret.password
        },
      },
      toJSON: {
        transform: function(doc, ret) {
          delete ret.password
        },
      },
    },
    { timestamps: true }
  )

  /**
   * Pre-save hook that hashes the password and overrides the original one.
   */
  UserSchema.pre('save', function(next) {
    var user = this

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
      return next()
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
      if (err) {
        return next(err)
      }

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err)
        }

        // Override the plaintext password with the hashed one
        user.password = hash
        next()
      })
    })
  })

  /**
   * Method used to test if the user provided the right password.
   * @param {String} candidatePassword Input password to be tested.
   * @param {Function} cb Callback function to be executed after the test.
   *                      The first parameter is the error (if there is one)
   *                      and the second is a boolean telling if the password
   *                      matched or not.
   */
  UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    var user = this

    bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
      if (err) {
        return cb(err)
      }
      cb(undefined, isMatch)
    })
  }

  mongoose.model('User', UserSchema)

  module.exports = UserSchema
})()
