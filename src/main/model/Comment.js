(function () {
    'use strict';

    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;


    var CommentSchema = new Schema({
        
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: [true, 'Um comentário precisa de texto.']
        }
        
    }, { timestamps: true });

    mongoose.model('Comment', CommentSchema);

    module.exports = CommentSchema;
})();
