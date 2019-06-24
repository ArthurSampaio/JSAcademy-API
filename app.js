(function () {
    'use strict';
    
    require('dotenv').config();

    var express = require('express');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var cors = require('cors');
    var errorHandler = require('errorhandler');
    var mongoose = require('mongoose');

    require('./src/main/model');

    var app = express();

    var server_port = process.env.PORT || 8000;
    var is_production = process.env.NODE_ENV === 'production';

    if (is_production) {
        mongoose.connect(process.env.MONGODB_ADDRESS + '/JSACADEMY');
    } else {
        mongoose.connect('mongodb://127.0.0.1:27017/JSACADEMY-TEST');
        mongoose.set('debug', true);

        app.use(errorHandler());
    }

    var routesMiddleware = require('./src/main/middleware/routesMiddleware');

    var dbConn = mongoose.connection;
    dbConn.on('error', function (e) {
        console.error(e);
    });
    dbConn.on('open', function () {
        console.log('DB connection established.');
    });

    app.use(cors());
    app.use(morgan('combined'));
    app.use(bodyParser.json({ limit: '30mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));

    app.set('port', server_port);
    app.set('address', process.env.ADDRESS || '127.0.0.1');

    routesMiddleware.set(app);

    app.listener = app.listen(server_port, function () {
        console.log('Server listening on port ' + app.listener.address().port + '.');
    });
})();