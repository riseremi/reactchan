var APIEndpoints = {
	use: function (app) {
		route(app);
	}
};

var route = function (app) {
	app.get('/api', function (req, res) {
		res.send('GET');
	});
	app.delete('/api', function (req, res) {
		res.send('DELETE');
	});

	app.post('/api', function (req, res) {
		res.send('POST');
	});

	app.put('/api', function (req, res) {
		res.send('PUT');
	});

}


module.exports = APIEndpoints;