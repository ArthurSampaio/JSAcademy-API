(function () {
    'use strict';
    
    var _ = require('lodash');

    _.BAD_REQUEST = 400;
    _.NOT_FOUND = 404;
    _.FORBIDDEN = 403;
    _.UNAUTHORIZED = 401;
    _.OK = 200;
    _.CREATED = 201;

    _.FIRST_INDEX = 0;
    _.INVALID_INDEX = -1;

    _.ONE_HOUR = 3600000;
    _.THIRTY_MINUTES = _.ONE_HOUR / 2;

    /**
     * Check if an array contains an object.
     *
     * @param {Array} array Array to be checked.
     * @param {Object} object Object to be checked.
     * @returns {Boolean} True if the array contains the object. False otherwise.
     */
    _.contains = function (array, object) {
        return array.indexOf(object) !== -1;
    };

    /**
     * Copy the properties of one object to another.
     * Target object needs to be a Mongoose object.
     *
     * @param {Object} toObject Mongoose object that will receive the properties.
     * @param {Object} fromObject Object that will provide the properties to be copied.
     */
    _.copyModel = function (toObject, fromObject) {
        _.each(fromObject, function (value, key) {
            if (_.contains(key, '_')) {
                return;
            }

            var keys = key.split('.');
            _.set(toObject, keys, value);
            toObject.markModified(_.first(keys));
        });

        _.each(toObject.toObject(), function (value, key) {
            if (!fromObject[key] && !_.includes(key, '_')) {
                toObject[key] = undefined;
            }
        });
    };

    module.exports = _;
})();
