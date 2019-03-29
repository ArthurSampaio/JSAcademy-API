(function () {
    'use strict';
    
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var passportJWT = require("passport-jwt");
    var UserService = require('../service/userService');

    var JWTStrategy = passportJWT.Strategy;
    var ExtractJWT = passportJWT.ExtractJwt;

    /**
    * Interceptor used in the /api/token to validate the login.
    */
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        function (email, password, cb) {
            return UserService.getUserByEmail(email, true)
                .then(function (user) {
                    return user.comparePassword(password, function (err, match) {
                        if (err) {
                            return cb(err);
                        } else if (!match) {
                            return cb(null, false, 'Password incorreto.');
                        } else {
                            if (!user) {
                                return cb(null, false, 'Usuário não encontrado.');
                            }
                            return cb(null, user.toObject(), 'Logado com sucesso.');
                        }
                    });
                })
                .catch(function (err) {
                    return cb(err);
                });
        }
    ));

    /**
    * Interceptor used by protected endpoints. Validates Bearer 
    * tokens sent in the Authorization header.
    */
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET
    },
        function (jwtPayload, cb) {
            return UserService.getUser(jwtPayload._id)
                .then(function (user) {
                    return cb(null, user);
                })
                .catch(function (err) {
                    return cb(err);
                });
        }
    ));

    module.exports = passport;
})();
