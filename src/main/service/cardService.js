(function () {
    'use strict';

    var mongoose = require('mongoose');
    var _ = require('../util/util');

    
    var Card = mongoose.model('Card');

    /**
     * Service that handles operations involving backlogs.
     */
    var CardService = {};

    /**
     * Create a new card.
     *
     * @param {Object} card Card to be saved.
     * @returns {Promise} Promise with the new user.
     */
    CardService.createCard = function(card){
        return new Card(card).save()
            .then(function (persistedCard) {
                return persistedCard.toObject();
            });
    }
    

    module.exports = CardService;
})();