var express = require('express');
var compress = require('compression');
var app = express();

// enable gzip compression
app.use(compress());

// write request method and URI in the console
app.use(function(req, res, next) {
	console.log('%s: %s', req.method, req.url);
	next();
});

// serve / as /dist
app.use('/', express.static(__dirname + '/dist'));

// since we're building an SPA, return index.html by default
app.get('*', function(req, res) {
	res.sendFile(__dirname + '/dist/index.html');
});

// listen
app.listen(8080, function() {
	console.log('Listening on port 8080...');
});
