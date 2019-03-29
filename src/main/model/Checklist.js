(function () {
    'use strict';

    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;
    var ItemCheckSchema = require('./ItemCheck');


    var ChecklistSchema = new Schema({
        name: {
            type: String,
            required: [true, 'Uma checklist precisa de um nome.']
        }, 
        itensChecked: [{
            type: ItemCheckSchema
        }]        
    }, { timestamps: true });

    mongoose.model('Checklist', ChecklistSchema);

    module.exports = ChecklistSchema;
})();