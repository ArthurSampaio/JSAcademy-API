(function () {
    'use strict';

    var _ = require('../util/util');
    var passport = require('../auth/passport');

    var tokenRouter = require('../router/tokenRouter');
    var userRouter = require('../router/userRouter');
    //var teamRouter = require('../router/teamRouter');
    var moduleRouter = require('../router/moduleRouter');


    var routesMiddleware = {};

    /**
     * Configure application routes.
     * @param {Object} app Express application.
     */
    routesMiddleware.set = function (app) {
        app.use('/api/token', tokenRouter);
        app.use('/api/user', userRouter);
        app.use('/api/module', moduleRouter);
        // app.use('/api/organization', passport.authenticate('jwt', { session: false }), organizationRouter);
        // teamRouter.use('/:teamId/backlog', backlogRouter);
        // teamRouter.use('/:teamId/sprint', sprintRouter);
        // organizationRouter.use('/:organizationId/team', teamRouter);
    };

    module.exports = routesMiddleware;
})();
