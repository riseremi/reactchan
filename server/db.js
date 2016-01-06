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
		
		if(post.text.length < 1) {
			console.log('Cannot add an empty post');
			return;
		}

		postsDB.find({}).sort({id: -1}).limit(1).exec(function (err, docs) {
			console.log(docs);
			maxIndex = docs[0].id;
			post.id = maxIndex + 1;
			post.timestamp = new Date().getTime();

			postsDB.insert(post, function (err, newDoc) { // Callback is optional
				// newDoc is the newly inserted document, including its _id
				cb();
			});
		});
	},

	findAllPosts: function (cb) {
		postsDB.find({}).sort({
			id: -1
		}).exec(function (err, docs) {
			cb(docs);
		});
	}

};
