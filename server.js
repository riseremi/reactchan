'use strict';

var express = require('express');
var compress = require('compression');
var app = express();
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var APIEndpoints = require('./server/APIEndpoints');
var nedb = require('./server/db.js');

var logger = require('./server/utils/Logger');

var SITE_URL = 'http://chan-riseremi.c9users.io/';

// enable gzip compression
app.use(compress());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '10kb'}));
app.use(favicon(__dirname + '/dist/favicon.ico'));


// write request method and URI in the console
// app.use(function(req, res, next) {
// 	logger.info(req.method + ': ' + req.url);
// 	next();
// });

app.use('/', express.static(__dirname + '/dist'));

// API endpoints goes here, all invalid requests will pass through
// right to the '*'
APIEndpoints.use(app);

// test database call
nedb.init();

// since we're building an SPA, return index.html by default
app.get('*', function(req, res) {
	res.sendFile(__dirname + '/dist/index.html');
});

app.listen(8080, function() {
	console.log('Listening on port 8080...');
});
