(function () {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var OrganizationSchema = new Schema({
        name: {
            type: String,
            required: [true, 'Uma organização precisa de um nome.']
        },
        description: {
            type: String
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        teams: [{
            type: Schema.Types.ObjectId,
            ref: 'Team'
        }],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {
            timestamps: true
        }
    );

    mongoose.model('Organization', OrganizationSchema);

    module.exports = OrganizationSchema;
})();
