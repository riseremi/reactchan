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

	var postSomething = function (req, res) {
		var postJSON = req.body;

		// routes
		// 1. NO SUBJECT = post
		// 2. SUBJECT = thread
		// mail - sage = <a>Anonymous</a>

		if (postJSON.subject) {
			// create thread
			createThread(postJSON);
		}
		else {
			// create post
			createPost(postJSON);
		}

	};
	app.post('/board', postSomething);

	app.get('/posts', function (req, res) {
		res.get('Content-Type') || res.set('Content-Type', 'application/json');
		nedb.findAllPosts(function (posts) {
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
function createThread(postJSON) {
	// create thread + OP post

	var thread = {
		id: N,
		board_id: postJSON.board_id,
		name: postJSON.subject
	};

	nedb.insertThread(thread, function () {});
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