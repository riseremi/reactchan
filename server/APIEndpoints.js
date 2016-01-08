'use strict';

var nedb = require('./db.js');
var NCT = require('./NCT');
var BOARDS = ['dev', 'beta'];

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

	// submit post or thread
	var postSomething = function (req, res) {
		// oh yeah, let's do that
		if (!req.headers['referer']) {
			return;
		}

		var postJSON = req.body;
		postJSON.timestamp = new Date().getTime();

		if (postJSON.subject) {
			// create thread
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

	app.delete('/api', function (req, res) {
		res.send('DELETE');
	});

	app.post('/posts', function (req, res) {
		// one more time
		if (!req.headers['referer']) {
			return;
		}
		var post = req.body;

		// ;)
		post.text = NCT(post.text);

		nedb.insertPost(post, function () {
			res.json({
				status: 'success'
			});
		});

	});

	app.put('/api', function (req, res) {
		res.send('PUT');
	});
};

// operations
function createThread(post, cb) {
	// create thread + OP post

	if (!isBoardExists(post.boardCode)) {
		console.log('Requested board does not exist.');
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
	BOARDS.map((board) => {
		if (boardCode === board && !boardExist) {
			boardExist = true;
		}
	});
	return boardExist;
}

function createPost(postJSON) {
	// create post
	if (postJSON.email === 'sage') {
		// create sage post
	}
	else {
		// create normal post
	}
}



module.exports = APIEndpoints;