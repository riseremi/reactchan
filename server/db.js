var Datastore = require('nedb');

var postsDB = new Datastore({
	filename: 'databases/posts.db',
	autoload: true
});

module.exports = {

	init: function () {

		// 1 hour * 60 mins * 60 secs * 1000 ms
		postsDB.persistence.setAutocompactionInterval(1 * 60 * 60 * 1000);
	},

	getDB: function () {
		return postsDB;
	},

	insertPost: function (post, cb) {
		var maxIndex;

		postsDB.count({}, function (err, count) {
			maxIndex = count;

			post.id = maxIndex + 1;

			postsDB.insert(post, function (err, newDoc) { // Callback is optional
				// newDoc is the newly inserted document, including its _id
				cb();
			});
		});
	},

	findAllPosts: function (cb) {
		postsDB.find({}).sort({
			id: 1
		}).exec(function (err, docs) {
			cb(docs);
		});
	}

};
