var nedb = require('./db.js');

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

		nedb.insertPost(post, function () {
			res.json({
				status: 'success'
			});
		});

	});

	app.put('/api', function (req, res) {
		res.send('PUT');
	});

}


module.exports = APIEndpoints;