(function () {
  'use strict';

  var mongoose = require('mongoose');
  var _ = require('../util/util');
  var Module = mongoose.model('Module');

  /**
   * Service that handles operations involving models.
   */
  var ModuleService = {};


  ModuleService.getModules = function (raw) {
    var rawModules = Module.find({}).exec();

    return rawModules.then(function (modules) {
      if (!modules) {
        throw Error("No modules founded.");
      }
      return raw ?
        rawModules : _.map(modules, function (mod) {
          return mod.toObject();
        })
    });
  };

  ModuleService.getModule = function (moduleId, raw) {
    var params = {
      _id: moduleId
    };

    var rawModule = Module.findOne(params).exec();
    return rawModule.then(function (mod) {
      if (!mod) {
        throw Error("There's no module with the given ID: " + moduleId);
      }
      return raw ? rawModule : mod.toObject();
    });
  };

  ModuleService.createModule = function (moduleData) {

    return new Module(moduleData).save().then(function (moduleSaved) {
      return moduleSaved.toObject();
    });
  };


  module.exports = ModuleService;
})();
