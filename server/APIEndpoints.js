var nedb = require('./db.js');
var NCT = require('./NCT');

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
		var postJSON = req.body;

		// routes
		// 1. NO SUBJECT = post
		// 2. SUBJECT = thread
		// mail - sage = <a>Anonymous</a>

		if (postJSON.subject) {
			// create thread
			createThread(postJSON, function () {
				res.json({
					status: 'success'
				});
			});
		}
		else {
			// create post
			createPost(postJSON);
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

	var thread = {
		boardCode: post.boardCode,
		subject: post.subject
	};

	nedb.insertThread(thread, post, cb);
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