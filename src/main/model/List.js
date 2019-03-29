(function () {
    'use strict';

    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;
    var CardSchema = require('./Card');

    var Card = mongoose.model('Card');

    var ListSchema = new Schema({
        name: {
            type: String,
            required: [true, 'Uma lista de cards precisa ter um nome.']
        },
        cards: [{
            type: CardSchema
        }]
        
    }, { timestamps: true });
    
    mongoose.model('List', ListSchema);

    module.exports = ListSchema;
})();
