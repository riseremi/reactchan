'use strict';

var nedb = require('./db.js');
var NCT = require('./NCT');
var logger = require('./utils/Logger');
var config = require('./config');
var tripcode = require('tripcode');

var APIEndpoints = {
	use: function (app) {
		route(app);
	}
};

var route = function (app) {
	app.get('/api', function (req, res) {
		// wildcards
		// res.send('GET: ' + req.params.name);
		// query params
		// res.send('GET: ' + req.param('name'));
	});

	// submit thread
	var postSomething = function (req, res) {
		// oh yeah, let's do that
		if (!req.headers['referer']) {
			return;
		}

		var postJSON = req.body;
		postJSON.timestamp = new Date().getTime();

		if (postJSON.subject) {
			createThread(postJSON, function () {
				res.json({
					status: 'success'
				});
			});
		}
		else {
			// TODO create post
			// createPost(postJSON);
		}
	};
	app.post('/board', postSomething);

	// load thread list
	var getThreadList = function (req, res) {
		var boardCode = req.params.boardCode;

		res.get('Content-Type') || res.set('Content-Type', 'application/json');
		nedb.findThreadsByBoardCode(boardCode, function (threads) {
			res.json(threads);
		});
	};
	app.get('/board/:boardCode', getThreadList);

	app.get('/posts/:threadId', function (req, res) {
		var threadId = +req.params.threadId;

		res.get('Content-Type') || res.set('Content-Type', 'application/json');
		nedb.findPostsByThreadId(threadId, function (posts) {
			res.json(posts);
		});
	});

	app.get('/post/:id', function (req, res) {
		var id = parseInt(req.params.id, 10);

		nedb.findPostById(id, function(post) {
			res.json(post);
		});
	});

	app.post('/posts', function (req, res) {
		// one more time
		if (!req.headers['referer']) {
			return;
		}
		var post = req.body;

		// ;)
		post.text = NCT(post.text);

		// extract "password" so we can generate tripcode
		if (post.name.indexOf('#') !== -1) {
			logger.warn('RAW Tripcode: ' + encodeURIComponent(post.name.split('#')[1]));

			let parts = post.name.split('#');
			post.name = parts[0];
			post.tripcode = tripcode(parts[1]);
		}

		nedb.insertPost(post, function () {
			res.json({
				status: 'success'
			});
		});

	});
};

// operations
function createThread(post, cb) {
	// create thread + OP post

	if (!isBoardExists(post.boardCode)) {
		logger.warn('Requested board does not exist.');
		return;
	}

	var thread = {
		boardCode: post.boardCode,
		subject: post.subject,
		updatedAt: post.timestamp
	};

	nedb.insertThread(thread, post, cb);
}

function isBoardExists(boardCode) {
	let boardExist = false;
	config.boards.map((board) => {
		if (boardCode === board && !boardExist) {
			boardExist = true;
		}
	});
	return boardExist;
}

module.exports = APIEndpoints;
