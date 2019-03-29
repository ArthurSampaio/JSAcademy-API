(function () {
    'use strict';

    var _ = require('../util/util');
    var passport = require('../auth/passport');

    var tokenRouter = require('../router/tokenRouter');
    var userRouter = require('../router/userRouter');
    var organizationRouter = require('../router/organizationRouter');
    var teamRouter = require('../router/teamRouter');
    var backlogRouter = require('../router/backlogRouter');
    var sprintRouter = require('../router/sprintRouter');

    var routesMiddleware = {};

    /**
     * Configure application routes.
     * @param {Object} app Express application.
     */
    routesMiddleware.set = function (app) {
        app.use('/api/token', tokenRouter);
        app.use('/api/user', userRouter);
        // app.use('/api/organization', passport.authenticate('jwt', { session: false }), organizationRouter);
        // teamRouter.use('/:teamId/backlog', backlogRouter);
        // teamRouter.use('/:teamId/sprint', sprintRouter);
        // organizationRouter.use('/:organizationId/team', teamRouter);
    };

    module.exports = routesMiddleware;
})();
