(function () {
    'use strict';

    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;

    var ItemCheckSchema = new Schema({
        name: {
            type: String,
            required: [true, 'Um ItemCheck precisa de um nome.']
        },
        checked: {
            type: Boolean,
            default: false            
        }        
    }, { timestamps: true });

    mongoose.model('ItemCheck', ItemCheckSchema);

    module.exports = ItemCheckSchema;
})();
