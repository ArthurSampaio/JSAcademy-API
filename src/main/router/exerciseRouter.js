(function () {
  'use strict';

  var express = require('express');
  var _ = require('../util/util');


  var ModuleService = require('../service/moduleService');

  /**
   * Router used to access the user entity.
   * URL: /api/user
   */
  var moduleRouter = express.Router();

  moduleRouter.get(['', '/'], function (req, res) {
    return ModuleService.getModules().then(function (response) {
      return res.status(_.OK).json(response);
    }).catch(function (error) {
      return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
    });
  });

  moduleRouter.get('/:moduleId', function (req, res) {
    return ModuleService.getModule(req.params.moduleId).then(function (response) {
      return res.status(_.OK).json(response);
    }).catch(function (error) {
      return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
    });
  });

  moduleRouter.post(['', '/'], function (req, res) {
    return ModuleService.createModule(req.body)
      .then(function (response) {
        return res.status(_.CREATED).json(response);
      })
      .catch(function (error) {
        return res.status(error.status || _.BAD_REQUEST).json(error.message || error);
      });
  });





  module.exports = moduleRouter;
})();
